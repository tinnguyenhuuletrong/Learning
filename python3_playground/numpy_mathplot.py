import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn
seaborn.set()

data = pd.read_csv('./data/president_heights.csv')
heights = np.array(data['height(cm)'])

plt.hist(heights)
plt.title('Height Distribution of US Presidents')
plt.xlabel('height (cm)')
plt.ylabel('number')
plt.show()
