import numpy as np
import pandas as pd

index = [('California', 2000), ('California', 2010),
         ('New York', 2000), ('New York', 2010),
         ('Texas', 2000), ('Texas', 2010)]
populations = [33871648, 37253956,
               18976457, 19378102,
               20851820, 25145561]

pop = pd.Series(populations, index=index)
print('Seri-Bad:')
print(pop)
print('------------------')
multiIndex = pd.MultiIndex.from_tuples(index)
pop = pop.reindex(multiIndex)
print('Seri-MultiIndex:')
print(pop)
print('------------------')
print("Lookup  pop['California'][2010]:", pop['California'][2010])
print("Lookup  pop['California', 2010]:", pop['California', 2010])
print('------------------')
print("Lookup  pop[:, 2010]:")
print(pop[:, 2010])
print('------------------')
pop_df = pop.unstack()

print("MultiIndex -> DataFrame")
print(pop_df)

print('------------------')
pop1 = pop_df.stack()
print("DataFrame -> MultiIndex")
print(pop1)


print('------------------')
data = {('California', 2000): 33871648,
        ('California', 2010): 37253956,
        ('Texas', 2000): 20851820,
        ('Texas', 2010): 25145561,
        ('New York', 2000): 18976457,
        ('New York', 2010): 19378102}
print('Quick Create:')
print(pd.Series(data))

print('------------------')
index = pd.MultiIndex.from_product([[2013, 2014], [1, 2]],
                                   names=['year', 'visit'])
columns = pd.MultiIndex.from_product([['Bob', 'Guido', 'Sue'], ['HR', 'Temp']],
                                     names=['subject', 'type'])

# mock some data
data = np.round(np.random.randn(4, 6), 1)
data[:, ::2] *= 10
data += 37

# create the DataFrame
health_data = pd.DataFrame(data, index=index, columns=columns)
print('Complex DF:')
print(health_data)

print('Complex Select Guido:')
print(health_data['Guido'])

print('Complex Select Guido - HR only visit 1:')
idx = pd.IndexSlice
print(health_data.loc[idx[:, 1], ('Guido', 'HR')])

print('mean by year:')
print(health_data.mean(level='year'))
