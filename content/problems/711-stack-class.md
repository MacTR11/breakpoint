--- meta
{"title": "Build a Stack", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Stacks", "points": 25, "track": "structures", "specRef": "1.4.2", "contest": "structures-derby", "functionName": "Stack",
  "tests": [
    {"steps": [["Stack"], ["push", "a"], ["push", "b"], ["peek"], ["pop"], ["pop"], ["pop"]], "expected": [1, 2, "b", "b", "a", null]},
    {"steps": [["Stack"], ["is_empty"], ["size"], ["peek"]], "expected": [true, 0, null]},
    {"steps": [["Stack"], ["push", 1], ["push", 2], ["pop"], ["push", 3], ["size"], ["pop"], ["pop"], ["is_empty"]], "expected": [1, 2, 2, 2, 2, 3, 1, true], "hidden": true},
    {"steps": [["Stack"], ["push", 0], ["is_empty"], ["peek"], ["size"]], "expected": [1, false, 0, 1], "hidden": true}
  ]
}
--- description
A stack is a **last in, first out** structure.

Complete the class `Stack`, which starts empty.

| Method | What it does |
| --- | --- |
| `push(item)` | Adds `item` to the top. Returns the new number of items. |
| `pop()` | Removes and returns the top item, or returns `None` if the stack is empty. |
| `peek()` | Returns the top item **without** removing it, or `None` if the stack is empty. |
| `is_empty()` | Returns `True` if there are no items. |
| `size()` | Returns the number of items. |

### Example

```python
stack = Stack()
stack.push("a")   # 1
stack.push("b")   # 2
stack.peek()      # "b"
stack.pop()       # "b"
```
--- hints
- Keep the items in a Python list, with the top of the stack at the **end**: `append` pushes and `pop()` pops.
- `pop` and `peek` must check for an empty stack first and return `None`. The top item is `self.items[-1]`.
--- starter
class Stack:
    def __init__(self):
        # Set up your attributes here
        pass

    def push(self, item):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def is_empty(self):
        pass

    def size(self):
        pass
--- solution
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)
        return len(self.items)

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)
