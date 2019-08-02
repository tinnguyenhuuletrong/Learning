#!/usr/local/bin/python3

import numpy as np

# Basic


def basic():
    a = np.array([1, 2, 3])
    b = np.array([(1, 2, 3), (4, 5, 6)], dtype=float)
    c = np.array([[(1.5, 2, 3), (4, 5, 6)]], dtype=float)
    print("basic - array 1D", a)
    print("basic - array 2D", b)
    print("basic - array 3D", c)


# Init
def init():
    a = np.zeros((3, 4))  # 3 x 4
    b = np.ones((2, 3, 4), dtype=np.int16)  # 2 x 3 x 4
    f = np.eye(2)  # 2 x 2 identity matrix
    g = np.empty((3, 2))

    print("init - zero", a)
    print("init - one", b)
    print("init - identity matrix", f)
    print("init - empty matrix", g)


def io():
    a = np.random.random_sample(8)
    print("io - random array", a)
    np.save('random_array.npy', a)
    b = np.load('random_array.npy')
    print("io - load array", b)
    assert a == b


def math():
    a = np.random.random_sample((2, 2))
    b = np.random.random_sample((2, 2))
    print(a, b)
    print('a + b', '=', a + b)
    print('a - b', '=', a - b)
    print('a * b', '=', a * b)
    print('a / b', '=', a / b)

    a = np.array([1, 0, 0])
    b = np.array([0, 1, 0])
    np.cross(a, b)
    print('a dot b', '=', a.dot(b))
    print('a cross b', '=', np.cross(a, b))


def aggreate():
    a = np.random.random_sample(4)
    print(np.sort(a))
    print('min a', '=', np.min(a))
    print('max a', '=', np.max(a))
    print('mean a', '=', np.mean(a))
    print('median a', '=', np.median(a))
    print('standard deviation', '=', np.std(a))


# https: // www.tutorialspoint.com/numpy/numpy_indexing_and_slicing
def subset_slicing():
    a = np.array([1, 2, 3])
    b = np.array([(1.5, 2, 3), (4, 5, 6)])

    print('a -> ', a)
    print('b -> ', b)

    print(a[2], '-> 3')
    print(b[1, 2], '-> 6')

    print("start:stop:step")
    print(a[0:2], '-> "0:2" start at 0 stop at 2 items -> [1,2]')
    print(b[0:2, 1], '-> "0:2, 1" index 0 get 2 items where column = 1 -> [2,5]')
    print(b[:1], '-> ":1" all item at row 0, start begin, stop end, step 1')

    # ellipsis (…) to make a selection tuple of the same length as the dimension of an array
    print(b[..., 1:], '-> "..., 1:" remove first column')

    # reverse
    print(a[::-1], '-> "::-1" step -1 (reverse)')


if __name__ == "__main__":
    subset_slicing()
