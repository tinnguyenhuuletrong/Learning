# https://leetcode.com/problems/monotonic-array


from typing import List


class Solution:

    def _isInc(self, nums: List[int]) -> bool:
        i = 1
        l = len(nums)
        while i <l:
            if nums[i] < nums[i-1]:
                return False
            i+=1
        return True
    
    def _isDec(self, nums: List[int]) -> bool:
        i = 1
        l = len(nums)
        while i <l:
            if nums[i] > nums[i-1]:
                return False
            i+=1
        return True

    def isMonotonic(self, nums: List[int]) -> bool:
        return self._isInc(nums) or self._isDec(nums)
       

a = Solution()
inp = [1,2,2,3]
print(inp, '->', a.isMonotonic(inp))
inp = [6,5,4,4]
print(inp, '->', a.isMonotonic(inp))
inp = [1,3,2]
print(inp, '->', a.isMonotonic(inp))