import numpy as np
import pandas as pd

# Series - Dic
a = pd.Series([1, 2, 3, 4])
print('a index', a.index)
print('a value', a.values)

b = pd.Series([1, 2, 3, 4], index=['a', 'b', 'c', 'd'])
print('b index', b.index)
print('b value', b.values)
print('b["a"]', b['a'])

population_dict = {'California': 38332521,
                   'Texas': 26448193,
                   'New York': 19651127,
                   'Florida': 19552860,
                   'Illinois': 12882135}
population = pd.Series(population_dict)
print('population', population)
print('population["California":"Florida"]', population['California':'Florida'])


area_dict = {'California': 423967, 'Texas': 695662, 'New York': 141297,
             'Florida': 170312, 'Illinois': 149995}
area = pd.Series(area_dict)


# DataFrame - 2D Dic
states = pd.DataFrame({'population': population,
                       'area': area})
print('DataFrame: states= \n', states)
print('states.index', states.index)
print('states.columns', states.columns)
print('states["area"]["Texas"]', states['area']['Texas'])

dataFrameFromDic = pd.DataFrame(data=[{'a': i, 'b': 2 * i}
                                      for i in range(3)])
print('dataFrameFromDic', dataFrameFromDic)

dataFrameFromNumpy = pd.DataFrame(np.random.rand(3, 2),
                                  columns=['foo', 'bar'],
                                  index=['a', 'b', 'c'])
print('dataFrameFromNumpy', dataFrameFromNumpy)

# Index is immutable Set
indA = pd.Index([1, 3, 5, 7, 9])
indB = pd.Index([2, 3, 5, 7, 11])
print(indA, indB)
print('intersection', indA & indB)
print('union', indA | indB)
print('symmetric difference', indA ^ indB)
