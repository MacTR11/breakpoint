--- meta
{"title": "Trace Table", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "While loops", "points": 10, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["6", "7", "8", "9"], "answer": 2}
--- description
```python
n = 6
steps = 0
while n != 1:
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
    steps += 1
print(steps)
```

What does this program print?
--- hints
- Draw a trace table with columns for `n` and `steps`.
- Even numbers are halved; odd numbers are tripled and 1 is added.
--- explanation
Follow `n` through the loop:

6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1

That is **8** steps before `n` reaches 1 and the loop stops.
