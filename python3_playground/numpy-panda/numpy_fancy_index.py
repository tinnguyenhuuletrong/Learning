import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn

seaborn.set()


def basic():
    rand = np.random.RandomState(42)
    x = rand.randint(100, size=10)
    print(x)

    ind = [3, 7, 4]
    print('ind', ind, '->', x[ind])

    ind = np.array([[3, 7],
                    [4, 5]])
    print('ind', ind, '->', x[ind])

    X = np.arange(12).reshape((3, 4))
    print('X', '=', X)

    row = np.array([0, 1, 2])
    col = np.array([2, 1, 3])
    print('X[row,col]', '=', X[row, col])
    print('X[row[:, np.newaxis], col]', '=', X[row[:, np.newaxis], col])
    print('X[2, [2, 0, 1]]', '=', X[2, [2, 0, 1]])
    print('X[1:, [2, 0, 1]]', '=', X[1:, [2, 0, 1]])

    mask = np.array([1, 0, 1, 0], dtype=bool)
    print('X[row[:, np.newaxis], mask]', '=', X[row[:, np.newaxis], mask])


def ran_points():
    rand = np.random.RandomState(42)
    mean = [0, 0]
    cov = [[1, 2],
           [2, 5]]
    X = rand.multivariate_normal(mean, cov, 100)
    indices = np.random.choice(X.shape[0], 20, replace=False)
    selection = X[indices]
    plt.scatter(X[:, 0], X[:, 1], alpha=0.3)
    plt.scatter(selection[:, 0], selection[:, 1],
                s=200, alpha=0.5)
    plt.show()


def histogram_diy():
    # np.random.seed(42)
    x = np.random.randn(100)

    # compute a histogram by hand
    bins = np.linspace(-5, 5, 20)

    # Zero array same shape
    counts = np.zeros_like(bins)

    # find the appropriate bin 's index for each x (a[i-1] < v <= a[i])
    i = np.searchsorted(bins, x)

    # add 1 to each of these bins
    np.add.at(counts, i, 1)

    plt.plot(bins, counts, linestyle='steps')
    plt.show()


def histogram_better():
    # np.random.seed(42)
    x = np.random.randn(100)

    # compute a histogram by hand
    bins = np.linspace(-5, 5, 20)

    hist, edges = np.histogram(x, bins)
    print(hist, edges)

    plt.hist(x, bins, histtype='step')
    plt.show()


# ran_points()
# histogram_diy()
histogram_better()
