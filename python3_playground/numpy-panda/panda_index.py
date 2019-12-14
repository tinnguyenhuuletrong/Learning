import numpy as np
import pandas as pd

area = pd.Series({'California': 423967, 'Texas': 695662,
                  'New York': 141297, 'Florida': 170312,
                  'Illinois': 149995})
pop = pd.Series({'California': 38332521, 'Texas': 26448193,
                 'New York': 19651127, 'Florida': 19552860,
                 'Illinois': 12882135})
data = pd.DataFrame({'area': area, 'pop': pop})
data['density'] = data['pop'] / data['area']


print('data', data)
print('filter density > 90 & pop < 38332521',
      data[(data['density'] > 90) & (data['pop'] < 38332521)])

print('Transpose')
print(data.T)


# Select row by index [0, 3], col [0, 1]
print('Select row by index iloc[:3, :2] \n', data.iloc[:3, :2])
# Select row by explicit index :'Illinois', :'pop'
print(
    "Select row by explicit index loc[:'Illinois', :'pop'] \n", data.loc[:'Illinois', :'pop'])


# Operations DataFrame
rng = np.random.RandomState(42)
A = pd.DataFrame(rng.randint(0, 20, (2, 2)),
                 columns=list('AB'))
B = pd.DataFrame(rng.randint(0, 10, (3, 3)),
                 columns=list('BAC'))
print('A = \n', A)
print('B = \n', B)
print('A + B', '= \n', A + B)


# Operations DataFrame vs Series
df = pd.DataFrame(rng.randint(10, size=(3, 4)), columns=list('QRST'))
print('df = \n', df)
print('df - df.iloc[0] = \n', df - df.iloc[0])
print('halfdf = \n', df.iloc[:, ::2])
print('df - df.iloc[:, ::2] = \n', (df - df.iloc[:, ::2]).fillna(-99999))
