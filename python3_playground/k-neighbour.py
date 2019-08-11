import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn

seaborn.set()


# X = np.random.rand(30, 2)
X = np.array([(1, 1), (2, 2), (3, 3), (4, 4)])

# Simple - Calculate dist_sq ( distance pair X[i] vs others )
# differences = X[:, np.newaxis] - X[np.newaxis, :]
# sq_differences = differences ** 2
# dist_sq = np.sum(sq_differences, 2)  # (3,3,2) Axis == 2 => sum only aixs = 2

# Advance
dist_sq = np.sum((X[:, np.newaxis] - X[np.newaxis, :]) ** 2, axis=-1)


# print(sq_differences)
# print(dist_sq)

# argsort -> return indices of sorted ( instead of value )
nearest = np.argsort(dist_sq, axis=1)  # axis=1 => Sort only aixs 1
# print(nearest)

K = 2
# argpartition -> Return indices of array which first (K + 1) is the lowest value
nearest_partition = np.argpartition(dist_sq, K + 1, axis=1)
print(nearest_partition)


plt.scatter(X[:, 0], X[:, 1], s=100)
for i in range(X.shape[0]):
    for j in nearest_partition[i, :K+1]:
        # plot a line from X[i] to X[j]
        # use some zip magic to make it happen:
        plt.plot(*zip(X[j], X[i]), color='black')

plt.show()
