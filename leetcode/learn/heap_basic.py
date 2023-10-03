import heapq
import numpy as np
from typing import Iterable

def make_heap(iterable: Iterable):
    h = []
    for value in iterable:
        heapq.heappush(h, value)
    return h
    
data = np.random.randint(low=1, high=1000, size=10).tolist()
print("Data:", data)

h = make_heap(data)

print("3 largest:", heapq.nlargest(3, h))
print("4 smallest:", heapq.nsmallest(4, h))

sorted_arr = [heapq.heappop(h) for i in range(len(h))]
print("Heap sort:", sorted_arr)

