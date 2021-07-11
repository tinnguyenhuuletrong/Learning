import cv2
import subprocess as sp
import numpy

import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_face_mesh = mp.solutions.face_mesh


IMG_W = 640
IMG_H = 480
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
face_mesh = mp_face_mesh.FaceMesh(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5)


def face_mesh_detect(image):
    # Flip the image horizontally for a later selfie-view display, and convert
    # the BGR image to RGB.
    image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
    # To improve performance, optionally mark the image as not writeable to
    # pass by reference.
    image.flags.writeable = False
    results = face_mesh.process(image)

    # Draw the face mesh annotations on the image.
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            mp_drawing.draw_landmarks(
                image=image,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACE_CONNECTIONS,
                landmark_drawing_spec=drawing_spec,
                connection_drawing_spec=drawing_spec)
    return image


# all input protocol here
# https://ffmpeg.org/ffmpeg-protocols.html
FFMPEG_BIN = "/usr/local/bin/ffmpeg"
ffmpeg_cmd = [FFMPEG_BIN,

              # cat /Users/admin/Downloads/test-3.mp4 | python ffmpeg_opencv_facemesh.py
              #   '-i', 'pipe:0'

              '-i', '/Users/admin/Downloads/test-3.mp4',
              # '-r', '1',					# FPS
              # opencv requires bgr24 pixel format.
              '-vf', 'scale=w=640:h=480',
              '-pix_fmt', 'bgr24',
              '-vcodec', 'rawvideo',
              '-an', '-sn',              	# disable audio processing
              '-f', 'image2pipe', '-']
pipe = sp.Popen(ffmpeg_cmd, stdout=sp.PIPE, bufsize=10)

while True:
    raw_image = pipe.stdout.read(IMG_W*IMG_H*3)
    if len(raw_image) == 0:
        break
    # convert read bytes to np
    image = numpy.frombuffer(raw_image, dtype='uint8')
    image = image.reshape((IMG_H, IMG_W, 3))
    image = face_mesh_detect(image)

    cv2.imshow('Video', image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

pipe.stdout.flush()
cv2.destroyAllWindows()
