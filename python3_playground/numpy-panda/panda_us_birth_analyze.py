import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
sns.set()

births = pd.read_csv('data/births.csv')

print(births)

# decade
births['decade'] = 10 * (births['year'] // 10)
pivot_decade = births.pivot_table(
    'births', index='decade', columns='gender', aggfunc='sum')
print('')
print('Pivot decade(sum):')
print(pivot_decade)

# Plot
# pivot_decade.plot()
# plt.ylabel('total births per year')
# plt.show()

print('')

# Cleanup data (remove invalid date)
quartiles = np.percentile(births['births'], [25, 50, 75])
mu = quartiles[1]
sig = 0.74 * (quartiles[2] - quartiles[0])
print('[25, 50, 75] percentage value', quartiles)
print('center(50%): ', mu)
print('range: ', sig)
births = births.query('(births > @mu - 5 * @sig) & (births < @mu + 5 * @sig)')

# Create timeseries index
births['day'] = births['day'].astype(int)
births.index = pd.to_datetime(10000 * births.year +
                              100 * births.month +
                              births.day, format='%Y%m%d')
births['dayofweek'] = births.index.dayofweek
print('Trim outline, Timeseri index:')
print(births)

# births.pivot_table('births', index='dayofweek',
#                    columns='decade', aggfunc='mean').plot()
# plt.gca().set_xticklabels(['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'])
# plt.ylabel('mean births by day')
# plt.show()

print('')
# Analyze by month (ps - we pick 2012 b.c it is leap year -  29th )
# Pivot table day in year (mean)
births_by_date = births.pivot_table('births',
                                    [births.index.month, births.index.day])
# Timeseries index by day of year
births_by_date.index = [pd.datetime(2012, month, day)
                        for (month, day) in births_by_date.index]
print('Birth by day in year (mean):')
print(births_by_date)

# births_by_date.plot()
# plt.show()
