from video_stream_ffmpeg import VideoStreamFFmpeg
from video_stream_cv import VideoStreamCV
import cv2
import time

def main():
    fsp = 30
    resolution = (640, 480)
    mirror = True
    cam_stream = VideoStreamFFmpeg(src=0, fps=fsp, resolution=resolution)
    # cam_stream = VideoStreamCV(src=0, fps=fsp, resolution=resolution)
    window_name = "{0}".format(cam_stream.__class__.__name__)
    
    while True:
        img = cam_stream.read()
        if img is not None:
            if mirror: 
                img = cv2.flip(img, 1)
            cv2.imshow(window_name, img)
        if cv2.waitKey(1) == 27: 
            break  # esc to quit

    cam_stream.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
