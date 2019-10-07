import numpy as np
import pandas as pd
import seaborn as sns

npDateTime = np.datetime64('2015-07-04 12:59:59.50')
print('npDate:', npDateTime)

print('')
pdDate = pd.to_datetime("4th of July, 2015")
print('pdDate:', pdDate)
print(pdDate.strftime('%A'))

print('')
pdAddDate = pdDate + pd.to_timedelta(np.arange(12), 'D')
print('Pd date ops:')
print(pd.Series(pdAddDate).map(lambda x: x.strftime('%A')))


print('')
pdDatePeriod = pdAddDate.to_period('D')
print('Pd Delta time: ', 'pdDatePeriod - pdDatePeriod[0]')
print(pdDatePeriod - pdDatePeriod[0])
