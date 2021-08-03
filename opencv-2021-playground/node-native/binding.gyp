{
    "targets": [
        {
            "target_name": "addon",
            "sources": ["./nan/addon.cc"],
            'include_dirs': [
                "/usr/local/include/opencv4"
            ],
            "link_settings": {
                "libraries": [
                    "-L/usr/local/Cellar/opencv/4.5.2_3/lib",
                    "-lopencv_gapi",
                    "-lopencv_stitching",
                    "-lopencv_alphamat",
                    "-lopencv_aruco",
                    "-lopencv_bgsegm",
                    "-lopencv_bioinspired",
                    "-lopencv_ccalib",
                    "-lopencv_dnn_objdetect",
                    "-lopencv_dnn_superres",
                    "-lopencv_dpm",
                    "-lopencv_face",
                    "-lopencv_freetype",
                    "-lopencv_fuzzy",
                    "-lopencv_hfs",
                    "-lopencv_img_hash",
                    "-lopencv_intensity_transform",
                    "-lopencv_line_descriptor",
                    "-lopencv_mcc",
                    "-lopencv_quality",
                    "-lopencv_rapid",
                    "-lopencv_reg",
                    "-lopencv_rgbd",
                    "-lopencv_saliency",
                    "-lopencv_sfm",
                    "-lopencv_stereo",
                    "-lopencv_structured_light",
                    "-lopencv_phase_unwrapping",
                    "-lopencv_superres",
                    "-lopencv_optflow",
                    "-lopencv_surface_matching",
                    "-lopencv_tracking",
                    "-lopencv_highgui",
                    "-lopencv_datasets",
                    "-lopencv_text",
                    "-lopencv_plot",
                    "-lopencv_videostab",
                    "-lopencv_videoio",
                    "-lopencv_viz",
                    "-lopencv_wechat_qrcode",
                    "-lopencv_xfeatures2d",
                    "-lopencv_shape",
                    "-lopencv_ml",
                    "-lopencv_ximgproc",
                    "-lopencv_video",
                    "-lopencv_dnn",
                    "-lopencv_xobjdetect",
                    "-lopencv_objdetect",
                    "-lopencv_calib3d",
                    "-lopencv_imgcodecs",
                    "-lopencv_features2d",
                    "-lopencv_flann",
                    "-lopencv_xphoto",
                    "-lopencv_photo",
                    "-lopencv_imgproc",
                    "-lopencv_core"
                ]
            },
            "cflags": [
                "-std=c++11"
            ],
            "cflags!": [
                "-fno-exceptions"
            ],
            "cflags_cc!": [
                "-fno-rtti",
                "-fno-exceptions"
            ],
            "xcode_settings": {
                "OTHER_CFLAGS": [
                    "-std=c++11",
                    "-stdlib=libc++",
                    "-frtti"
                ],
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                "MACOSX_DEPLOYMENT_TARGET": "10.9"
            },
        }
    ],
}
