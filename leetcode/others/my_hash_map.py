import pprint

class MyHashMap:

    def __init__(self):
        self._data = {}

    def put(self, key: int, value: int) -> None:
        self._data[key] = value

    def get(self, key: int) -> int:
        return self._data.get(key, -1)

    def remove(self, key: int) -> None:
        if key in self._data:
            del self._data[key]

obj = MyHashMap()
obj.put(1,1)
param_2 = obj.get(1)
obj.remove(1)
pprint.pprint(obj.get(2))
obj.remove(1)
