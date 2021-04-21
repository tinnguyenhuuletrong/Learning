import os
import shutil
import pickle
import streamlit as st

# To make things easier later, we're also importing numpy and pandas for
# working with sample data.
import streamlit.components.v1 as components

import module


st.title("My face recog app")
uid = st.text_input("Enter uuid")

if uid != "":
    workingDir = "./tmp/%s/" % uid
    videoFilePath = "%s/video.mp4" % workingDir
    modelFilePath = "%s/model.pkl" % workingDir

    # ensure file exists
    os.makedirs(workingDir, exist_ok=True)

    has_model = os.path.exists(modelFilePath)
    has_video = os.path.exists(videoFilePath)

    if not has_video:
        st.subheader("Train model")
        uploaded_file = st.file_uploader("File uploader", type=["mp4"])
        if uploaded_file is not None:
            # write video
            my_bar = st.progress(0)
            with open(videoFilePath, "wb") as f:
                f.write(uploaded_file.getvalue())

            my_bar.progress(0.2)

            def print_progress(v):
                st.write(v)

            model, faces = module.video_process(videoFilePath, log=print_progress)
            # dump model
            pickle.dump(model, open(modelFilePath, "wb"))

            has_video = True
            has_model = True
            my_bar.progress(1)
            st.info("model saved. %d face(s)" % (len(faces)))

    if has_video:
        st.subheader("Face video")
        video_file = open(videoFilePath, "rb")
        video_bytes = video_file.read()
        video_file.close()
        st.video(video_bytes)

    st.subheader("Detect face")
    if has_model:
        loaded_model = pickle.load(open(modelFilePath, "rb"))
        img_file = st.file_uploader("File uploader", type=["jpg", "png"])
        if img_file is not None:
            buffer = img_file.getbuffer()
            res = module.face_detect(loaded_model, buffer)
            display_img = module.draw_face_rec(
                buffer, res["face_locations"], res["results"]
            )
            st.image(display_img)
            res
