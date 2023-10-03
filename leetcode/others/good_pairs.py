# https://leetcode.com/problems/number-of-good-pairs/

# nCr = n! / (r! * (n-r)! 

from typing import List
import itertools
import functools

class Solution:
    @functools.cache
    def factorial(self, val: int) -> int:
        if val <=0:
            return 1
        return functools.reduce(lambda a,b: a*b, range(1, val+1))
    
    def nC2(self, val: int) -> int:
        tmp1 = self.factorial(val)
        return round (tmp1 / (2 * self.factorial(val - 2)))

    def numIdenticalPairs(self, nums: List[int]) -> int:
        nums = sorted(nums)
        total = 0
        for k,g in itertools.groupby(nums):
            num = len(list(g))
            if num > 1:
                val = self.nC2(num)
                total += val

        return total
    
a = Solution()
nums = [1,2,3,1,1,3]
print(nums, a.numIdenticalPairs(nums))
nums = [1,1,1,1]
print(nums, a.numIdenticalPairs(nums))
nums = [1,2,3]
print(nums, a.numIdenticalPairs(nums))