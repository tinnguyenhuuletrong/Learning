import numpy as np
import pandas as pd
import seaborn as sns
planets = sns.load_dataset('planets')


print('head:')
print(planets.head())
print('------------------')
print('tail:')
print(planets.tail())
print('------------------')
print('dropna & describe:')
print(planets.dropna().describe())
