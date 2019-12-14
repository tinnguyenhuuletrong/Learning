import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pandas_datareader import data
sns.set()

print('')
print('From Range - Business year end day between 2004-01-01 => 2016-12-31')
print(pd.date_range('2004-01-01', '2016-12-31', freq='BA'))

print('')
print('Google Finance from 2004 -> 2016')
finance = data.DataReader('GOOG', start='2004', end='2016',
                          data_source='yahoo')
print(finance.head())
financeClose = finance['Close']
financeClose.plot(alpha=0.5, style='-')

# Mark points by Business year end (BA)
financeClose.resample('BA').mean().plot(style=':')
financeClose.asfreq('BA').plot(style='--')
plt.legend(['input', 'resample - average of the previous year', 'asfreq - value at the end of the year'],
           loc='upper left')
plt.title('GOOG Stock Close Price - yahoo')
plt.show()
