import math
import cv2
from av import VideoFrame
from aiortc import (
    VideoStreamTrack,
)


class ImageViewStreamTrack(VideoStreamTrack):
    """
    A video track that returns an animated flag.
    """

    def __init__(self, img_path):
        super().__init__()  # don't forget this!
        self.img = cv2.imread(img_path)

    async def recv(self):
        pts, time_base = await self.next_timestamp()
        scale = float((math.sin(pts * time_base) + 1) / 2) + 0.0005
        rot = int(pts * time_base * 45)
        # rotate image
        rows, cols, _ = self.img.shape
        M = cv2.getRotationMatrix2D(
            (cols / 2, rows / 2), rot, scale)
        img = cv2.warpAffine(self.img, M, (cols, rows))

        # create video frame
        frame = VideoFrame.from_ndarray(img, format="bgr24")
        frame.pts = pts
        frame.time_base = time_base

        return frame
