import cv2
from .pipeline import Pipeline


class ProcessGrayscale(Pipeline):
    def __init__(self, src, dest='grayscale'):
        self.src = src
        self.dest = dest
        super(ProcessGrayscale, self).__init__()

    def map(self, data):
        image = data[self.src]
        grey = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        grey_with_channels = cv2.cvtColor(grey, cv2.COLOR_GRAY2RGB)
        data[self.dest] = grey_with_channels
        data['_grey_one_channel'] = grey
        return data
