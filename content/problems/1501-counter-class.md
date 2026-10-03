--- meta
{"title": "A click counter", "kind": "CODE", "difficulty": "EASY", "topic": "Classes", "points": 10, "track": "oop", "specRef": "1.2.4", "functionName": "Counter",
  "tests": [
    {"steps": [["Counter"], ["value"], ["click"], ["click"], ["value"]], "expected": [0, null, null, 2]},
    {"steps": [["Counter"], ["click"], ["undo"], ["undo"], ["value"]], "expected": [null, null, null, 0]},
    {"steps": [["Counter"], ["click"], ["click"], ["click"], ["reset"], ["value"], ["click"], ["value"]], "expected": [null, null, null, null, 0, null, 1], "hidden": true},
    {"steps": [["Counter"], ["undo"], ["value"]], "expected": [null, 0], "hidden": true}
  ]
}
--- description
A steward counts people into a gig with a hand-held clicker. Write the class `Counter` with:

- a constructor that starts the count at 0
- `click()`, which adds 1
- `undo()`, which takes 1 off, but never below 0
- `reset()`, which sets the count back to 0
- `value()`, which returns the count.

`click`, `undo` and `reset` do not need to return anything.
--- hints
- Store the count in an attribute in the constructor: `self.count = 0`. Every method then reads or changes `self.count`.
- In `undo`, only subtract when the count is above 0.
--- starter
class Counter:
    def __init__(self):
        pass
--- solution
class Counter:
    def __init__(self):
        self.count = 0

    def click(self):
        self.count = self.count + 1

    def undo(self):
        if self.count > 0:
            self.count = self.count - 1

    def reset(self):
        self.count = 0

    def value(self):
        return self.count
