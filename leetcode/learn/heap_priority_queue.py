from heapq import heappop, heappush
import itertools

class PriorityQueue:
    pq = []                         # list of entries arranged in a heap
    entry_finder = {}               # mapping of tasks to entries
    REMOVED = '<removed-task>'      # placeholder for a removed task
    counter = itertools.count()     # unique sequence count

    def add_task(self, task, priority=0):
        'Add a new task or update the priority of an existing task'
        if task in self.entry_finder:
            self.remove_task(task)
        count = next(self.counter)
        entry = [priority, count, task]
        self.entry_finder[task] = entry
        heappush(self.pq, entry)

    def remove_task(self, task):
        'Mark an existing task as REMOVED.  Raise KeyError if not found.'
        entry = self.entry_finder.pop(task)
        entry[-1] = self.REMOVED

    def pop_task(self):
        'Remove and return the lowest priority task. Raise KeyError if empty.'
        while self.pq:
            priority, count, task = heappop(self.pq)
            if task is not self.REMOVED:
                del self.entry_finder[task]
                return task
        raise KeyError('pop from an empty priority queue')


    def count_task(self):
        return len(self.entry_finder)
    
    def __str__(self) -> str:
        return "%s"%({
            "pq": self.pq,
            "entry_finder": self.entry_finder
        })


ins = PriorityQueue()
print("Init some data:")
ins.add_task("task1", 1)
ins.add_task("task2", 0)
ins.add_task("task3", 5)
print(ins)

print("Remove: task 1")
ins.remove_task("task1")
print(ins)
print("Pop:", ins.pop_task())
print("Len: ", ins.count_task())
print("Pop:", ins.pop_task())
print("Len: ", ins.count_task())