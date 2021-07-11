import cv2
import subprocess as sp
import numpy

IMG_W = 640
IMG_H = 480

FFMPEG_BIN = "/usr/local/bin/ffmpeg"
ffmpeg_cmd = [FFMPEG_BIN,
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

    cv2.imshow('Video', image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

pipe.stdout.flush()
cv2.destroyAllWindows()
