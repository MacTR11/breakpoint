--- meta
{"title": "Stack in an array (a): push, pop and peek", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Stacks", "points": 40, "track": "exam", "specRef": "1.4.2", "functionName": "Stack", "banned": [".append(", ".insert("],
  "tests": [
    {"steps": [["Stack", 3], ["is_empty"], ["push", 5], ["push", 9], ["peek"], ["pop"], ["pop"], ["pop"], ["is_empty"]], "expected": [true, true, true, 9, 9, 5, null, true]},
    {"steps": [["Stack", 2], ["push", "a"], ["push", "b"], ["push", "c"], ["is_full"], ["pop"], ["is_full"], ["peek"]], "expected": [true, true, false, true, "b", false, "a"]},
    {"steps": [["Stack", 1], ["peek"], ["pop"], ["push", 0], ["is_empty"], ["is_full"], ["pop"], ["push", 7], ["peek"]], "expected": [null, null, true, false, true, 0, true, 7], "hidden": true},
    {"steps": [["Stack", 4], ["push", 1], ["push", 2], ["pop"], ["push", 3], ["push", 4], ["push", 5], ["push", 6], ["pop"], ["pop"], ["pop"], ["pop"], ["pop"]], "expected": [true, true, 2, true, true, true, false, 5, 4, 3, 1, null], "hidden": true},
    {"steps": [["Stack", 0], ["is_empty"], ["is_full"], ["push", 1], ["pop"]], "expected": [true, true, false, null], "hidden": true}
  ]
}
--- description
A stack is stored in a one-dimensional array of fixed size, with an integer `top` that points to the item on top of the stack. `top` is `-1` when the stack is empty.

Write the class `Stack` with:

- a constructor `Stack(size)` that creates an array with room for `size` items and sets `top` to `-1`
- `is_empty()` and `is_full()`, which each return `True` or `False`
- `push(item)`, which adds the item to the top and returns `True`, or returns `False` without changing anything if the stack is full
- `pop()`, which removes and returns the top item, or returns `None` if the stack is empty
- `peek()`, which returns the top item without removing it, or `None` if the stack is empty.

Use the array and the `top` pointer: do not use `append`, or call `pop` on a list.

**[8 marks]**
--- hints
- Make the array in the constructor with `[None] * size`. Every method then works by changing `self.top` and reading or writing `self.items[self.top]`.
- The stack is full when `top` is `size - 1`. To push: add 1 to `top`, then store the item at that index.
- To pop: remember the item at `top`, subtract 1 from `top`, then return the remembered item. There is no need to wipe the old value.
--- starter
class Stack:
    def __init__(self, size):
        pass
--- solution
class Stack:
    def __init__(self, size):
        self.items = [None] * size
        self.size = size
        self.top = -1

    def is_empty(self):
        return self.top == -1

    def is_full(self):
        return self.top == self.size - 1

    def push(self, item):
        if self.is_full():
            return False
        self.top = self.top + 1
        self.items[self.top] = item
        return True

    def pop(self):
        if self.is_empty():
            return None
        item = self.items[self.top]
        self.top = self.top - 1
        return item

    def peek(self):
        if self.is_empty():
            return None
        return self.items[self.top]
--- explanation
One mark each, up to 8:

- The constructor creates an array of `size` elements and sets the pointer to `-1`.
- `is_empty` compares the pointer with `-1`.
- `is_full` compares the pointer with `size - 1`.
- `push` checks for a full stack first and returns `False`.
- `push` increments the pointer **before** storing the item at that index, and returns `True`.
- `pop` checks for an empty stack first and returns `None`.
- `pop` reads the item at the pointer **before** decrementing it, and returns the item.
- `peek` returns the item at the pointer without changing the pointer.
