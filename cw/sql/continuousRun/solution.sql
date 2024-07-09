-- https://til.simonwillison.net/sql/consecutive-groups
-- https://stackoverflow.com/questions/57775828/how-to-perform-a-running-count-on-null-values-that-resets-on-non-null-values

with ordered as (
  select 
    day_no,
    lag(day_no, 1, null)
      over (
        order by day_no asc
      ) 
      as prev_day,
    case when prev_day + 1 = day_no then 1 else 0 end as val
  from data
  order by day_no asc
), grouped as (
  select
  *,
  row_number() over (order by day_no) as r1,
  row_number() over (partition by  val order by day_no) as r2,
  val * (r1 - r2) as gid
  from ordered
  order by day_no
)
-- select * from grouped;
select 
  min(day_no) as begin_day_no,
  max(day_no) as end_day_no,
  count(*) as run_length
from grouped
group by gid
having gid >0
order by begin_day_no;


-- Output as
-- ┌──────────────┬────────────┬────────────┐
-- │ begin_day_no │ end_day_no │ run_length │
-- │    int64     │   int64    │   int64    │
-- ├──────────────┼────────────┼────────────┤
-- │            2 │          3 │          2 │
-- │            6 │         10 │          5 │
-- │           16 │         17 │          2 │
-- │           25 │         25 │          1 │
-- └──────────────┴────────────┴────────────┘

-- ┌────────┬──────────┬───────┬───────┬───────┬───────┐
-- │ day_no │ prev_day │  val  │  r1   │  r2   │  gid  │
-- │ int64  │  int64   │ int32 │ int64 │ int64 │ int64 │
-- ├────────┼──────────┼───────┼───────┼───────┼───────┤
-- │      1 │          │     0 │     1 │     1 │     0 │
-- │      2 │        1 │     1 │     2 │     1 │     1 │
-- │      3 │        2 │     1 │     3 │     2 │     1 │
-- │      5 │        3 │     0 │     4 │     2 │     0 │
-- │      6 │        5 │     1 │     5 │     3 │     2 │
-- │      7 │        6 │     1 │     6 │     4 │     2 │
-- │      8 │        7 │     1 │     7 │     5 │     2 │
-- │      9 │        8 │     1 │     8 │     6 │     2 │
-- │     10 │        9 │     1 │     9 │     7 │     2 │
-- │     15 │       10 │     0 │    10 │     3 │     0 │
-- │     16 │       15 │     1 │    11 │     8 │     3 │
-- │     17 │       16 │     1 │    12 │     9 │     3 │
-- │     20 │       17 │     0 │    13 │     4 │     0 │
-- │     22 │       20 │     0 │    14 │     5 │     0 │
-- │     24 │       22 │     0 │    15 │     6 │     0 │
-- │     25 │       24 │     1 │    16 │    10 │     6 │
-- ├────────┴──────────┴───────┴───────┴───────┴───────┤
-- │ 16 rows                                 6 columns │
-- └───────────────────────────────────────────────────┘