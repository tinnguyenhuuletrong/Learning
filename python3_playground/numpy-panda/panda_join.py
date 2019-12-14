import numpy as np
import pandas as pd

df1 = pd.DataFrame({'employee': ['Bob', 'Jake', 'Lisa', 'Sue'],
                    'group': ['Accounting', 'Engineering', 'Engineering', 'HR']})
df2 = pd.DataFrame({'employee': ['Lisa', 'Bob', 'Jake', 'Sue'],
                    'hire_date': [2004, 2008, 2012, 2014]})

print('df1:')
print(df1)
print('df2:')
print(df2)
print('--------One-to-one joins----------')
df3 = pd.merge(df1, df2)
print('pd.merge(df1, df2)')
print(df3)
print('---------Many-to-one joins---------')
df4 = pd.DataFrame({'group': ['Accounting', 'Engineering', 'HR'],
                    'supervisor': ['Carly', 'Guido', 'Steve']})
print('df4')
print(df4)
print('pd.merge(df3, df4)')
print(pd.merge(df3, df4))
print('---------Many-to-many joins---------')
df5 = pd.DataFrame({'group': ['Accounting', 'Accounting',
                              'Engineering', 'Engineering', 'HR', 'HR'],
                    'skills': ['math', 'spreadsheets', 'coding', 'linux',
                               'spreadsheets', 'organization']})
print('df5')
print(df5)
print('pd.merge(df1, df5)')
print(pd.merge(df1, df5))
print('---------Advance on---------')
print("pd.merge(df1, df2, on='employee')")
print(pd.merge(df1, df2, on='employee'))
print('---------Advance left_on, right_on---------')
df6 = pd.DataFrame({'name': ['Bob', 'Jake', 'Lisa', 'Sue'],
                    'salary': [70000, 80000, 120000, 90000]})
print('df6')
print(df6)
print('pd.merge(df1, df6, left_on="employee", right_on="name")')
print(pd.merge(df1, df6, left_on="employee", right_on="name"))
print('pd.merge(df1, df6, left_on="employee", right_on="name").drop("name", axis=1)')
print(pd.merge(df1, df6, left_on="employee", right_on="name").drop("name", axis=1))
print('---------Advance how (inner)---------')
df6 = pd.DataFrame({'name': ['Peter', 'Paul', 'Mary'],
                    'food': ['fish', 'beans', 'bread']},
                   columns=['name', 'food'])
df7 = pd.DataFrame({'name': ['Mary', 'Joseph'],
                    'drink': ['wine', 'beer']},
                   columns=['name', 'drink'])
print('df6')
print(df6)
print('df7')
print(df7)
print("pd.merge(df6, df7, how='inner')")
print(pd.merge(df6, df7, how='inner'))

print('---------Advance how (outer)---------')
print("pd.merge(df6, df7, how='outer')")
print(pd.merge(df6, df7, how='outer'))

print('---------Advance how (left)---------')
print("pd.merge(df6, df7, how='left')")
print(pd.merge(df6, df7, how='left'))

print('---------Advance how (right)---------')
print("pd.merge(df6, df7, how='right')")
print(pd.merge(df6, df7, how='right'))
print("pd.merge(df6, df7, how='right').dropna")
print(pd.merge(df6, df7, how='right').dropna())
