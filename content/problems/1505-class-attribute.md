--- meta
{"title": "Shared or separate?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Classes", "points": 10, "track": "oop", "specRef": "1.2.4", "check": "run", "options": ["2 1 3", "2 1 2", "3 3 3", "2 2 3"], "answer": 0}
--- description
```python
class Tally:
    total = 0

    def __init__(self):
        self.count = 0

    def add(self):
        self.count = self.count + 1
        Tally.total = Tally.total + 1

a = Tally()
b = Tally()
a.add()
a.add()
b.add()
print(a.count, b.count, Tally.total)
```

What does this program print?
--- hints
- `self.count` belongs to one object. Each of `a` and `b` has its own.
- `Tally.total` belongs to the class, so there is only one, shared by every object.
--- explanation
`count` is an **instance attribute**: `a` and `b` each have their own, so `a.count` is 2 and `b.count` is 1.

`total` is a **class attribute**: there is one copy, shared by every `Tally`, and all three calls to `add` increase it. So it prints `2 1 3`.
