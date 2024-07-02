with 
  tmp as 
  (
    select *, 
      concat(date_part('isoyear',attendance_date), '_', date_part('week',attendance_date)) as week_no, 
      date_part('dow',attendance_date) as dow,
      date_part('year',attendance_date) as year 
    from employee_attendance 
      where (date_part('dow',attendance_date) = 0 or date_part('dow',attendance_date) = 6) and date_part('year',attendance_date) = 2023
  )
select 
  employee_id, 
  count(distinct week_no) as weekends_worked,
  count(dow) as total_weekend_days_worked 
from 
  tmp
group by 
  employee_id
order by weekends_worked desc, total_weekend_days_worked desc, employee_id desc;
