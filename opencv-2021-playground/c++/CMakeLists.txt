cmake_minimum_required(VERSION 3.19)
project( OpenCV_Play )
set(OpenCV_STATIC ON)
find_package( OpenCV REQUIRED )
include_directories( ${OpenCV_INCLUDE_DIRS} )

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "./bin")

add_executable( DisplayImage DisplayImage.cpp )
target_link_libraries( DisplayImage ${OpenCV_LIBS} )

add_executable( DisplayVideo DisplayVideo.cpp )
target_link_libraries( DisplayVideo ${OpenCV_LIBS} )