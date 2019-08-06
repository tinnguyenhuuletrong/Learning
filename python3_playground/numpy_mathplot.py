import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn
seaborn.set()


def flot_distribution():
    data = pd.read_csv('./data/president_heights.csv')
    heights = np.array(data['height(cm)'])

    plt.hist(heights)
    plt.title('Height Distribution of US Presidents')
    plt.xlabel('height (cm)')
    plt.ylabel('number')
    plt.show()


def flot_2d():
    x = np.linspace(0, 5, 50)
    y = np.linspace(0, 5, 50)[:, np.newaxis]
    z = np.sin(x) ** 10 + np.cos(10 + y * x) * np.cos(x)
    print("X", x)
    print("Y", y)
    # print("np.sin(x) ** 10", np.sin(x) ** 10)
    # print("np.cos(10 + y * x)", np.cos(10 + y * x))
    # print("np.cos(x)", np.cos(x))
    print("Z", z)
    plt.imshow(z, origin='lower', extent=[0, 5, 0, 5],
               cmap='viridis')
    plt.colorbar()
    plt.show()


flot_2d()
