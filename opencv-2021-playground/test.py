import numpy as np
import pandas as pd
from deepface import DeepFace


def findEuclideanDistance(source_representation, test_representation):
    if type(source_representation) == list:
        source_representation = np.array(source_representation)

    if type(test_representation) == list:
        test_representation = np.array(test_representation)

    euclidean_distance = source_representation - test_representation
    euclidean_distance = np.sum(np.multiply(
        euclidean_distance, euclidean_distance))
    euclidean_distance = np.sqrt(euclidean_distance)
    return euclidean_distance


def encode_deepid_face(path):
    return DeepFace.represent(path, model_name="DeepID", detector_backend="mtcnn")


def encode_vgg_face(path):
    return DeepFace.represent(path, model_name="VGG-Face", detector_backend="mtcnn")


res1 = encode_vgg_face("/Users/admin/Downloads/me1.png")
res2 = encode_vgg_face("/Users/admin/Downloads/me2.png")

print(findEuclideanDistance(res1, res2))
