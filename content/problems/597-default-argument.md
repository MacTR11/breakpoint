--- meta
{"title": "Calling functions", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Functions", "points": 10, "track": "recursion", "specRef": "2.2.1", "check": "run", "options": ["6", "16", "26", "An error"], "answer": 1}
--- description
```python
def add(a, b=10):
    return a + b

print(add(1) + add(2, 3))
```

What does this program print?
--- hints
- `b=10` gives `b` a default value, used only when the call does not supply one.
--- explanation
`add(1)` gives no value for `b`, so the default of 10 is used: 1 + 10 = 11.

`add(2, 3)` supplies both, so `b` is 3: 2 + 3 = 5.

11 + 5 = **16**.
