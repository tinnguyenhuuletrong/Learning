#include <iostream>
#include <opencv2/opencv.hpp>
#include <filesystem>
#include "lib/haarFaceDetect.hpp"
using namespace cv;
using namespace std;

int main(int argc, char **argv){
  if (argc != 2)
  {
    std::cout << ("usage: DisplayVideo.out <Video_Path>\n");
    return -1;
  }

  std::string mode(argv[1]);  
  std::filesystem::remove_all("out");
  std::filesystem::create_directories("out/haar");

  // Create a VideoCapture object and open the input file
  // If the input is the web camera, pass 0 instead of the video file name
  VideoCapture cap = VideoCapture(mode.c_str()); 
   
  // Check if camera opened successfully
  if(!cap.isOpened()){
    std::cout << "Error opening video stream or file" << std::endl;
    return -1;
  }

  init_haarFaceDetect();
	Mat frame;
  while(1){
   
    // Capture frame-by-frame
    cap >> frame;
 
    // If the frame is empty, break immediately
    if (frame.empty())
      break;

    detect_haarFace(frame);

    // Display the resulting frame
    imshow( "Frame", frame );

    // Press  ESC on keyboard to exit
    // char c=(char)waitKey(25);
    // if(c==27)
      // break;
  }
 
  // When everything done, release the video capture object
  cap.release();
  // Closes all the frames
  destroyAllWindows();
  return 0;
}