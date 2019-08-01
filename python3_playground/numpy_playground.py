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
    assert (a == b, "equal")


if __name__ == "__main__":
    io()
