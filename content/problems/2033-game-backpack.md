--- meta
{"title": "Adventure game (c): the Backpack class", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Classes with arrays", "points": 40, "track": "exam", "specRef": "1.2.4", "functionName": "Backpack",
  "tests": [
    {"steps": [["Backpack", 2], ["add", "map"], ["add", "rope"], ["add", "torch"], ["count"], ["contains", "rope"], ["contains", "torch"]], "expected": [true, true, false, 2, true, false]},
    {"steps": [["Backpack", 3], ["add", "key"], ["add", "key"], ["count"], ["remove", "key"], ["remove", "key"], ["count"]], "expected": [true, false, 1, true, false, 0]},
    {"steps": [["Backpack", 1], ["remove", "coin"], ["contains", "coin"], ["add", "coin"], ["add", "gem"], ["remove", "coin"], ["add", "gem"], ["contains", "gem"], ["count"]], "expected": [false, false, true, false, true, true, true, 1], "hidden": true},
    {"steps": [["Backpack", 0], ["add", "x"], ["count"], ["contains", "x"]], "expected": [false, 0, false], "hidden": true},
    {"steps": [["Backpack", 4], ["add", "a"], ["add", "b"], ["add", "c"], ["remove", "b"], ["add", "d"], ["add", "e"], ["add", "f"], ["count"], ["contains", "b"], ["contains", "e"]], "expected": [true, true, true, true, true, true, false, 4, false, true], "hidden": true}
  ]
}
--- description
Each player in the adventure game carries a backpack, which can hold a limited number of items. Items are stored by name, and a backpack cannot hold two items with the same name.

Write the class `Backpack` with:

- a constructor `Backpack(capacity)` that creates an empty backpack able to hold `capacity` items
- `count()`, which returns how many items are in the backpack
- `contains(name)`, which returns `True` if an item with that name is in the backpack
- `add(name)`, which adds the item and returns `True`. If the backpack is full, or already contains an item with that name, it changes nothing and returns `False`.
- `remove(name)`, which removes the item and returns `True`, or returns `False` if it was not there.

**[8 marks]**
--- hints
- Store the capacity and an empty list in the constructor. `count` is then the length of the list.
- `add` has two reasons to refuse. Check both before appending: `len(self.__items) >= self.__capacity` and `self.contains(name)`.
--- starter
class Backpack:
    def __init__(self, capacity):
        pass
--- solution
class Backpack:
    def __init__(self, capacity):
        self.__capacity = capacity
        self.__items = []

    def count(self):
        return len(self.__items)

    def contains(self, name):
        for item in self.__items:
            if item == name:
                return True
        return False

    def add(self, name):
        if self.count() >= self.__capacity or self.contains(name):
            return False
        self.__items.append(name)
        return True

    def remove(self, name):
        if not self.contains(name):
            return False
        self.__items.remove(name)
        return True
--- explanation
One mark each, up to 8:

- The constructor stores the capacity and creates an empty collection of items.
- `count` returns the number of items held.
- `contains` searches the items and returns `True` when the name is found.
- `contains` returns `False` when it is not.
- `add` refuses when the backpack is full.
- `add` refuses when the name is already present.
- `add` otherwise stores the name and returns `True`.
- `remove` deletes the item and returns `True`, or returns `False` when it was not there.
