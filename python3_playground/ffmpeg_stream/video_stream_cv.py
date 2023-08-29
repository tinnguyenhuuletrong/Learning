from typing import Tuple
import cv2

class VideoStreamCV:
    def __init__(self, src: int, fps: int, resolution: Tuple[int, int]):
        self.src = src
        self.fps = fps
        self.resolution = resolution
        self.cap = self._open_camera()
        self.wait_for_cam()

    def _open_camera(self):
        cap = cv2.VideoCapture(self.src)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.resolution[0])
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resolution[1])
        fourcc = cv2.VideoWriter_fourcc(*"MJPG")
        cap.set(cv2.CAP_PROP_FOURCC, fourcc)
        cap.set(cv2.CAP_PROP_FPS, self.fps)
        return cap

    def read(self):
        ret, frame = self.cap.read()
        if not ret:
            return None
        return frame

    def release(self):
        self.cap.release()

    def wait_for_cam(self):
        for _ in range(30):
            frame = self.read()
        if frame is not None:
            return True
        return False