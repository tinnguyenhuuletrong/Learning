#include <dlib/image_processing/frontal_face_detector.h>
#include <dlib/gui_widgets.h>
#include <dlib/image_io.h>
#include <dlib/opencv/cv_image.h>
#include <opencv2/opencv.hpp>
#include <iostream>

using namespace dlib;
using namespace std;

int main(int argc, char **argv)
{
  try
  {
    if (argc == 1)
    {
      cout << "Give some image files as arguments to this program." << endl;
      return 0;
    }

    cv::Mat image;
    image = cv::imread(argv[1], 1);

    // Conversion: https://www.programmersought.com/article/9945276130/
    // Mat -> dlib image
    dlib::cv_image<rgb_pixel> dlib_img(image);

    frontal_face_detector detector = get_frontal_face_detector();
    std::vector<rectangle> dets = detector(dlib_img);

    cout << "Number of faces detected: " << dets.size() << endl;
    for(auto& it : dets) {
      cv::Rect rec(it.left(), it.top(), it.width(), it.height());
      cv::rectangle(image, rec, cv::Scalar(0, 0, 255), 2);
      std::cout << rec << std::endl;
    }

    cv::namedWindow("Output", cv::WINDOW_KEEPRATIO);
    cv::imshow("Output", image);
    cv::resizeWindow("Output", 400, 400);

    cv::waitKey(0);
  }
  catch (exception &e)
  {
    cout << "\nexception thrown!" << endl;
    cout << e.what() << endl;
  }
}
