// hello.cc using Node-API
#include <node_api.h>
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;


namespace demo {
  std::string parse_js_string(napi_env env, napi_value value)
  {
    napi_valuetype valuetype;
    napi_status status;
    size_t result;
    char Buffer[512];

    status = napi_typeof(env, value, &valuetype);
    assert(status == napi_ok);
    if (valuetype != napi_string)
    {
      napi_throw_error(env, NULL, "in valid type");
      return std::string("");
    }
    status = napi_get_value_string_utf8(env, value, Buffer, 512, &result);
    assert(status == napi_ok);

    return std::string(Buffer);
  }

  napi_value method_hello(napi_env env, napi_callback_info args) {
    napi_value greeting;
    napi_status status;

    status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
    if (status != napi_ok) return nullptr;
    return greeting;
  }

  napi_value method_cv_show_img(napi_env env, napi_callback_info info) {  
    napi_status status;

    // Args
    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);
    assert(argc == 1);

    // imgPath
    std::string img_path = parse_js_string(env, args[0]);

    Mat image;
    image = imread(img_path, 1);
    if (image.empty()) {
      return nullptr;
    }

    namedWindow("Output", WINDOW_KEEPRATIO);
    imshow("Output", image);
    resizeWindow("Output", 400, 200);

    waitKey(0);
    return nullptr;
  }

  napi_value method_cv_video_show(napi_env env, napi_callback_info info) {  
    napi_status status;

    // Args
    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);
    assert(argc == 1);

    // input
    std::string input_str = parse_js_string(env, args[0]);

    Mat frame;
    VideoCapture cap;
    if(input_str.empty()){
      cap.open(0, cv::CAP_ANY);
    } else {
      cap.open(input_str);
    }

    // check if we succeeded
    if (!cap.isOpened()) {
        std::cerr << "ERROR! Unable to open camera\n";
        return NULL;
    }

    for (;;)
    {
        // wait for a new frame from camera and store it into 'frame'
        cap.read(frame);
        // check if we succeeded
        if (frame.empty()) {
            break;
        }
        // show live and wait for a key with timeout long enough to show images
        imshow("Live", frame);
        if (waitKey(5) >= 0)
            break;
    }
    cap.release();
    return nullptr;
  }

  napi_value init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, nullptr, 0, method_hello, nullptr, &fn);
    if (status != napi_ok) return nullptr;

    status = napi_set_named_property(env, exports, "hello", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env, nullptr, 0, method_cv_show_img, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "cvImgShow", fn);
    if (status != napi_ok) return nullptr;
    
    status = napi_create_function(env, nullptr, 0, method_cv_video_show, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "cvVideoShow", fn);
    if (status != napi_ok) return nullptr;
    

    return exports;
  }

  NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo