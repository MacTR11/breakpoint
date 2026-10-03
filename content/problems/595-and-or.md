--- meta
{"title": "And comes before or", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Boolean expressions", "points": 10, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["True", "False", "5", "An error"], "answer": 0}
--- description
```python
x = 5
print(x > 3 and x < 4 or x == 5)
```

What does this program print?
--- hints
- `and` is worked out before `or`, just as multiplication comes before addition.
- Evaluate each of the three comparisons first, then combine them.
--- explanation
The three comparisons are `True`, `False` and `True`.

`and` binds more tightly than `or`, so the expression is `(True and False) or True`, which is `False or True`: **True**.
