import numpy as np
import pandas as pd
import seaborn as sns
titanic = sns.load_dataset('titanic')


print(titanic.head())

print('')
print('One demision:')
print(titanic.groupby('sex')[['survived']].mean())

print('')
print('Pivot:')
print(titanic.pivot_table('survived', index='sex', columns='class'))

print('')
print('Pivot Func(sum):')
print(titanic.pivot_table('survived', index='sex', columns='class', margins=True,
                          aggfunc='sum'))

print('')
print('Multi Func:')
print(titanic.pivot_table(index='sex', columns='class',
                          aggfunc={'survived': sum, 'fare': 'mean'}))

print('')
# Split age 2 group (0-18] , (18-80]
age = pd.cut(titanic['age'], [0, 18, 80])

# Auto Split fare 2 group
fare = pd.qcut(titanic['fare'], 2)
print('Pivot advance:')
print(titanic.pivot_table('survived', ['sex', age], [fare, 'class']))
