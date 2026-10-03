--- meta
{"title": "Follow the loop", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Tracing", "points": 5, "track": "basics", "specRef": "2.2.1", "contest": "python-sprint", "check": "run", "options": ["17", "24", "33", "48"], "answer": 2}
--- description
```python
x = 3
for i in range(4):
    x = x * 2 - 1
print(x)
```

What does this program print?
--- hints
- The loop runs 4 times. Write down `x` after each one.
--- explanation
Each time round, `x` is doubled and then 1 is taken off:

3 → 5 → 9 → 17 → **33**

The loop runs four times because `range(4)` produces 0, 1, 2 and 3.
