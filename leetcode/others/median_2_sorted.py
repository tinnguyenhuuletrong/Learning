# https://leetcode.com/problems/median-of-two-sorted-arrays
from typing import List
import math

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        lA = len(nums1)
        lB = len(nums2)
        total = lA + lB

        def next_smallest():
            l = nums1
            if len(nums1) <= 0:
                l = nums2
            elif len(nums2) <= 0:
                l = nums1
            else:
                if nums1[0] < nums2[0]:
                    l = nums1
                else:
                    l = nums2
            return l.pop(0)

        if total %2 != 0:
            num = math.ceil(total / 2)
            mean = 0
            while num >0:
                num-=1
                mean = next_smallest()
            return mean
        else:
            num = math.ceil(total / 2)
            meanA = 0
            meanB = 0
            while num >0:
                num-=1
                meanA = next_smallest()
            meanB = next_smallest()
            return (meanA + meanB) / 2




a = Solution()
print(a.findMedianSortedArrays([1,3], [2]))
print(a.findMedianSortedArrays([1,2], [3,4]))