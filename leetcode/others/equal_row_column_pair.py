
import json
from typing import List


class Solution:
    def equalPairs(self, grid: List[List[int]]) -> int:
        rows = map(lambda x: str(tuple(x)), grid)
        cols = zip(*grid)

        rows_stats = dict({})
        cols_stats = dict({})

        for it in rows:
            count = rows_stats.get(it, 0)
            rows_stats[it] = count + 1

        # print(json.dumps(rows_stats, indent=4))

        for it in cols:
            k = str(it)
            count = cols_stats.get(k, 0)
            cols_stats[k] = count + 1

        # print(json.dumps(cols_stats, indent=4))

        count = 0
        for k in rows_stats.keys():
            row_val = rows_stats.get(k)
            col_val = cols_stats.get(k, 0)
            v = row_val * col_val
            if v>0:
                count += v

        return count



a = Solution()
grid = [[3,2,1],[1,7,6],[2,7,7]]
print(grid, '->', a.equalPairs(grid))

grid = [[3,1,2,2],[1,4,4,5],[2,4,2,2],[2,4,2,2]]
print(grid, '->', a.equalPairs(grid))

grid = [[13,13],[13,13]]
print(grid, '->', a.equalPairs(grid))
