--- meta
{"contest": "upper-sixth-challenge", "title": "A stack that knows its smallest", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Stacks", "points": 25, "track": "structures", "specRef": "1.4.2", "functionName": "MinStack",
  "tests": [
    {"steps": [["MinStack"], ["push", 5], ["push", 3], ["minimum"], ["push", 7], ["minimum"], ["pop"], ["pop"], ["minimum"]], "expected": [null, null, 3, null, 3, 7, 3, 5]},
    {"steps": [["MinStack"], ["pop"], ["minimum"], ["peek"]], "expected": [null, null, null]},
    {"steps": [["MinStack"], ["push", 2], ["push", 2], ["pop"], ["minimum"]], "expected": [null, null, 2, 2]},
    {"steps": [["MinStack"], ["push", 4], ["push", 1], ["push", 6], ["pop"], ["peek"], ["minimum"], ["pop"], ["minimum"], ["pop"], ["minimum"]], "expected": [null, null, null, 6, 1, 1, 1, 4, 4, null], "hidden": true},
    {"steps": [["MinStack"], ["push", -1], ["push", 3], ["push", -5], ["minimum"], ["pop"], ["minimum"]], "expected": [null, null, null, -5, -5, -1], "hidden": true}
  ]
}
--- description
Write a class `MinStack`: a stack of numbers that can also say which is the smallest number on it.

- `push(item)` puts `item` on the top.
- `pop()` takes the top item off and returns it, or returns `None` if the stack is empty.
- `peek()` returns the top item without taking it off, or `None` if the stack is empty.
- `minimum()` returns the smallest item on the stack now, or `None` if it is empty.

For a challenge, make `minimum()` work without looking through the whole stack: keep a second stack of the smallest values so far.
--- hints
- A Python list makes a good stack: `append` pushes on to the end and `pop()` takes off the end.
- Keep a second list of minimums. Push on to it whenever the new item is at most the current minimum; when an item that equals the current minimum is popped, pop the minimums list too.
--- starter
class MinStack:
    def __init__(self):
        pass

    def push(self, item):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def minimum(self):
        pass
--- solution
class MinStack:
    def __init__(self):
        self.items = []
        self.mins = []

    def push(self, item):
        self.items.append(item)
        if len(self.mins) == 0 or item <= self.mins[-1]:
            self.mins.append(item)

    def pop(self):
        if len(self.items) == 0:
            return None
        item = self.items.pop()
        if item == self.mins[-1]:
            self.mins.pop()
        return item

    def peek(self):
        if len(self.items) == 0:
            return None
        return self.items[-1]

    def minimum(self):
        if len(self.mins) == 0:
            return None
        return self.mins[-1]
