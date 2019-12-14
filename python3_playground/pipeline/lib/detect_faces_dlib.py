import cv2
import dlib
from .pipeline import Pipeline
import numpy as np


def rect_to_bb(rect):
    # take a bounding predicted by dlib and convert it
    # to the format (x, y, w, h) as we would normally do
    # with OpenCV
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y

    # return a tuple of (x, y, w, h)
    return (x, y, w, h)


def shape_to_np(shape, dtype="int"):
    # initialize the list of (x, y)-coordinates
    coords = np.zeros((shape.num_parts, 2), dtype=dtype)

    # loop over all facial landmarks and convert them
    # to a 2-tuple of (x, y)-coordinates
    for i in range(0, shape.num_parts):
        coords[i] = (shape.part(i).x, shape.part(i).y)

    # return the list of (x, y)-coordinates
    return coords


class DlibDetectFaces(Pipeline):
    def __init__(self, src, dest_faces='faces', data_path="shape_predictor_68_face_landmarks.dat"):
        self.src = src
        self.dest_faces = dest_faces
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(data_path)
        super(DlibDetectFaces, self).__init__()

    def map(self, data):
        image = data[self.src]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        rects = self.detector(gray, 0)
        for (i, rect) in enumerate(rects):
            shape = self.predictor(gray, rect)
            shape = shape_to_np(shape)

            # Annotate face rect
            cv2.rectangle(image, rect_to_bb(rect), (0, 255, 0), thickness=5)

            # # Annotate landmarks
            for (x, y) in shape:
                cv2.circle(image, (x, y), 2, (0, 255, 0), -1)

        data[self.dest_faces] = rects
        return data
