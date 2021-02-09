cmake_minimum_required(VERSION 3.19)

# Enable C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED TRUE)

if(NOT CMAKE_BUILD_TYPE AND NOT (MSVC_IDE OR XCODE))
    set(CMAKE_BUILD_TYPE Release CACHE STRING "Build type, one of: Release, Debug" FORCE)
endif()

message( STATUS "Build type: ${CMAKE_BUILD_TYPE}" )
message( STATUS "Configuration types: ${CMAKE_CONFIGURATION_TYPES}" )

SET(64_BIT_OS TRUE)
message( STATUS "A 64-bit OS detected" )

project( OpenCV_Play )
find_package( OpenCV REQUIRED )
find_package( dlib REQUIRED)
find_package(nlohmann_json REQUIRED)

message(STATUS "OpenCV library status:")
message(STATUS "    config: ${OpenCV_DIR}")
message(STATUS "    version: ${OpenCV_VERSION}")
message(STATUS "    libraries: ${OpenCV_LIBS}")
message(STATUS "    include path: ${OpenCV_INCLUDE_DIRS}")

include_directories( ${OpenCV_INCLUDE_DIRS} )

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "./bin")

add_executable( DisplayImage DisplayImage.cpp )
target_link_libraries( DisplayImage ${OpenCV_LIBS})

add_executable( DisplayVideo DisplayVideo.cpp )
target_link_libraries( DisplayVideo ${OpenCV_LIBS} )

add_executable( DlibFace DlibFace.cpp )
target_link_libraries( DlibFace ${OpenCV_LIBS}  dlib::dlib )

add_executable( FaceExtractVideoHaar FaceExtractVideoHaar.cpp )
target_link_libraries( FaceExtractVideoHaar ${OpenCV_LIBS}  dlib::dlib )

add_executable( FaceExtractVideoDlib FaceExtractVideoDlib.cpp )
target_link_libraries( FaceExtractVideoDlib PRIVATE ${OpenCV_LIBS} dlib::dlib nlohmann_json::nlohmann_json)