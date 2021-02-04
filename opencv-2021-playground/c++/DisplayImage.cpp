#include <opencv2/opencv.hpp>
using namespace cv;
int main(int argc, char **argv)
{
  if (argc != 2)
  {
    std::cout << ("usage: DisplayImage.out <Image_Path>\n");
    return -1;
  }
  Mat image, gray, merge;
  image = imread(argv[1], 1);
  if (!image.data)
  {
    std::cout << ("No image data \n");
    return -1;
  }

  // Convert RGB -> Gray -> RGB
  cvtColor(image, gray, COLOR_RGB2GRAY);
  cvtColor(gray, gray, COLOR_GRAY2RGB);

  hconcat(image, gray, merge);
  std::cout << image.size << " " << gray.size << " -> " << merge.size();

  namedWindow("Output", WINDOW_KEEPRATIO);
  imshow("Output", merge);
  resizeWindow("Output", 400, 200);

  waitKey(0);
  return 0;
}