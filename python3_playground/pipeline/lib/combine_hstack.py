import cv2
from .pipeline import Pipeline
import numpy as np


class CombineHStack(Pipeline):
    def __init__(self, srcList, dest="output"):
        self.srcList = srcList
        self.dest = dest
        super(CombineHStack, self).__init__()

    def map(self, data={}):
        hstack_list = []
        for key in self.srcList:
            if key in data:
                image = data[key]
                hstack_list.append(image)

        data[self.dest] = np.hstack(hstack_list)
        return data
