#include <opencv2/opencv.hpp>
#include <stdio.h>
using namespace cv;

const char *faceCascadePath = "./data/haarcascade_frontalface_default.xml";
CascadeClassifier face_cascade;
Mat frame_gray;
int fcount = 0;
char buffer[50];
std::vector<Rect> faces;


void save_face(const Mat &frame, const Rect &rec)
{
	sprintf(buffer, "./out/haar/face_%d.jpg", fcount);
	imwrite(buffer, frame(rec));
	fcount++;
}

int init_haarFaceDetect()
{
	if (!face_cascade.load(faceCascadePath))
	{
		std::cout << "--(!)Error loading face cascade\n";
		return -1;
	}

	std::cout << "[haarFaceDetect] load completed" << std::endl;
	return 0;
}

void detect_haarFace(const Mat &frame)
{
	cvtColor(frame, frame_gray, COLOR_BGR2GRAY);
	cv::Size minSize = frame.size() /3;
	cv::Size maxSize = frame.size();
	face_cascade.detectMultiScale(frame_gray, faces, 1.1, 3, 0, minSize, maxSize);

	for (size_t i = 0; i < faces.size(); i++)
	{
		// rectangle(frame, faces[i], Scalar(255, 0, 0), 2);
		save_face(frame, faces[i]);
	}
}
