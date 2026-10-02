--- meta
{"title": "Fix: A Class Without Self", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Object-oriented error", "points": 20, "track": "debugging", "specRef": "1.2.4", "functionName": "Counter",
  "tests": [
    {"steps": [["Counter", 5], ["increment"], ["increment"]], "expected": [6, 7]},
    {"steps": [["Counter", 0], ["increment"], ["reset"], ["increment"]], "expected": [1, 0, 1]},
    {"steps": [["Counter", -2], ["increment"], ["increment"], ["reset"]], "expected": [-1, 0, 0], "hidden": true},
    {"steps": [["Counter", 10], ["reset"]], "expected": [0], "hidden": true}
  ]
}
--- description
A `Counter` is created with a starting number. `increment()` adds 1 to it and returns the new value. `reset()` sets it back to 0 and returns 0.

There are **two** bugs: one in `__init__` and one in `reset`.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- The error says the object has no attribute `count`. In `__init__`, a plain `count = start` makes a local variable that disappears when the method ends.
- In `reset`, look closely at the operator. `==` asks a question; `=` stores a value.
--- starter
class Counter:
    def __init__(self, start):
        count = start

    def increment(self):
        self.count = self.count + 1
        return self.count

    def reset(self):
        self.count == 0
        return self.count
--- solution
class Counter:
    def __init__(self, start):
        self.count = start

    def increment(self):
        self.count = self.count + 1
        return self.count

    def reset(self):
        self.count = 0
        return self.count
