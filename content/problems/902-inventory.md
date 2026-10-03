--- meta
{
  "title": "Stock room", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Class design", "points": 25, "track": "oop", "specRef": "3.3", "contest": "build-it-right",
  "functionName": "Inventory",
  "tests": [
    { "steps": [["Inventory"], ["add", "pen", 10], ["add", "pen", 5], ["count", "pen"], ["count", "ink"]], "expected": [10, 15, 15, 0] },
    { "steps": [["Inventory"], ["add", "pad", 3], ["remove", "pad", 5], ["remove", "pad", 3], ["count", "pad"], ["remove", "cup", 1]], "expected": [3, false, true, 0, false] },
    { "steps": [["Inventory"], ["add", "b", 2], ["add", "a", 1], ["add", "c", 9], ["low_stock", 3]], "expected": [2, 1, 9, ["a", "b"]] },
    { "steps": [["Inventory"], ["add", "x", 4], ["remove", "x", 4], ["low_stock", 1], ["low_stock", 0]], "expected": [4, true, ["x"], []], "hidden": true },
    { "steps": [["Inventory"], ["low_stock", 100], ["count", "q"]], "expected": [[], 0], "hidden": true },
    { "steps": [["Inventory"], ["add", "k", 5], ["remove", "k", 2], ["remove", "k", 2], ["remove", "k", 2], ["count", "k"]], "expected": [5, true, true, false, 1], "hidden": true }
  ]
}
--- description
Write a class `Inventory` that keeps track of stock levels. It is created with no arguments and starts with no items.

| Method | What it does |
| --- | --- |
| `add(item, quantity)` | Adds `quantity` of `item` to stock. Returns the new stock level of that item. |
| `remove(item, quantity)` | Takes `quantity` of `item` out of stock and returns `True`. If there is not enough (or the item has never been stocked), changes nothing and returns `False`. |
| `count(item)` | Returns the stock level of `item`, which is `0` for an item that has never been stocked. |
| `low_stock(threshold)` | Returns a list, in alphabetical order, of every item that has been stocked and whose level is now **below** `threshold`. |

Quantities are always positive whole numbers.

### Example

```python
inventory = Inventory()
inventory.add("pen", 10)       # 10
inventory.add("pen", 5)        # 15
inventory.remove("pen", 20)    # False: only 15 in stock
inventory.count("ink")         # 0
```
--- hints
- A dictionary mapping each item to its quantity does the job. `self.stock.get(item, 0)` gives 0 for an unknown item.
- In `remove`, compare the quantity asked for with `self.count(item)` and return `False` before changing anything if there is not enough.
--- starter
class Inventory:
    def __init__(self):
        # Decide what to store here
        pass

    def add(self, item, quantity):
        pass

    def remove(self, item, quantity):
        pass

    def count(self, item):
        pass

    def low_stock(self, threshold):
        pass
--- solution
class Inventory:
    def __init__(self):
        self.stock = {}

    def add(self, item, quantity):
        self.stock[item] = self.count(item) + quantity
        return self.stock[item]

    def remove(self, item, quantity):
        if self.count(item) < quantity:
            return False
        self.stock[item] -= quantity
        return True

    def count(self, item):
        return self.stock.get(item, 0)

    def low_stock(self, threshold):
        return sorted(item for item in self.stock if self.stock[item] < threshold)
