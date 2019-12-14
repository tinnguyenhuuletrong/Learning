import numpy as np

a = np.arange(3)  # [0, 1, 2]
b = np.arange(10)[:, np.newaxis]  # [[0],[1]...[9]]
X = a + b

# Broadcast Rule
# Rule 1: If the two arrays differ in their number of dimensions, the shape of the one with fewer dimensions is padded with ones on its leading (left) side.
# Rule 2: If the shape of the two arrays does not match in any dimension, the array with shape equal to 1 in that dimension is stretched to match the other shape.
# Rule 3: If in any dimension the sizes disagree and neither is equal to 1, an error is raised.

print(X)

# [[ 0  1  2]
#  [ 1  2  3]
#  [ 2  3  4]
#  [ 3  4  5]
#  [ 4  5  6]
#  [ 5  6  7]
#  [ 6  7  8]
#  [ 7  8  9]
#  [ 8  9 10]
#  [ 9 10 11]]

MeanX = np.mean(X, 0)
print("Mean By Column", MeanX)
CenterX = X - MeanX
print("Center", CenterX)
print("Validate Mean", CenterX.mean(0))
