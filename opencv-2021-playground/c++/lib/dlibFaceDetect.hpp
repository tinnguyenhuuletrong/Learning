#include <dlib/dnn.h>
#include <dlib/image_processing/frontal_face_detector.h>
#include <dlib/clustering.h>
#include <dlib/opencv/cv_image.h>
#include <dlib/opencv/to_open_cv.h>
#include <opencv2/opencv.hpp>
#include <fstream>
#include <nlohmann/json.hpp>
#include "./dlib_dbb_types.h"

using namespace dlib;
using namespace cv;

int fcount = 0;
char buffer[50];
frontal_face_detector detector;
shape_predictor sp;
anet_type net;
std::vector<matrix<rgb_pixel>> faces;

void save_face(const Mat &frame)
{
  sprintf(buffer, "./out/dlib/face_%d.jpg", fcount);
  imwrite(buffer, frame);
  fcount++;
}

void save_face_descriptor(std::vector<matrix<float, 0, 1>> face_descriptors)
{
  std::ofstream f("./out/dlib/_descriptor.json", std::ofstream::binary);
  nlohmann::json j;
  j["data"] = face_descriptors;
  f << j;
  f.close();
}

int init_dlibFaceDetect()
{
  detector = get_frontal_face_detector();
  std::cout << "[dlib::get_frontal_face_detector] load completed" << std::endl;

  // We will also use a face landmarking model to align faces to a standard pose:  (see face_landmark_detection_ex.cpp for an introduction)
  deserialize("./data/shape_predictor_5_face_landmarks.dat") >> sp;

  std::cout << "[dlib::shape_predictor] load completed" << std::endl;

  // And finally we load the DNN responsible for face recognition.
  deserialize("./data/dlib_face_recognition_resnet_model_v1.dat") >> net;

  std::cout << "[dlib::face_recognition] load completed" << std::endl;

  return 0;
}

void detect_dlibFace(const Mat &frame)
{
  dlib::cv_image<rgb_pixel> dlib_img(frame);
  std::vector<dlib::rectangle> dets = detector(dlib_img);

  for (auto &it : dets)
  {
    // cv::Rect rec(it.left(), it.top(), it.width(), it.height());
    // std::cout <<rec <<std::endl;
    // cv::rectangle(frame, rec, Scalar(255, 0, 0), 2);

    auto shape = sp(dlib_img, it);
    matrix<rgb_pixel> face_chip;
    extract_image_chip(dlib_img, get_face_chip_details(shape, 150, 0.25), face_chip);

    save_face(dlib::toMat(face_chip));
    faces.push_back(move(face_chip));
  }
}

void extract_dlibDescriptor()
{
  if (faces.size() == 0)
  {
    std::cout << "No faces found in image!" << std::endl;
    return;
  }
  std::cout << "Encode: " << faces.size() << std::endl;
  std::vector<matrix<float, 0, 1>> face_descriptors = net(faces);

  std::vector<sample_pair> edges;
  for (size_t i = 0; i < face_descriptors.size(); ++i)
  {
    for (size_t j = i; j < face_descriptors.size(); ++j)
    {
      // Faces are connected in the graph if they are close enough.  Here we check if
      // the distance between two face descriptors is less than 0.6, which is the
      // decision threshold the network was trained to use.  Although you can
      // certainly use any other threshold you find useful.
      auto len = length(face_descriptors[i] - face_descriptors[j]);
      if (len < 0.6)
        edges.push_back(sample_pair(i, j));

      std::cout << i << " : " << j << " = " << len << std::endl;
    }
  }

  std::vector<unsigned long> labels;
  const auto num_clusters = chinese_whispers(edges, labels);
  cout << "number of people found in the image: " << num_clusters << endl;
  save_face_descriptor(face_descriptors);
}