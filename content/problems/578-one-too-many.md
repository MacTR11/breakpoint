--- meta
{"title": "One step too far", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Index error", "points": 10, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["It prints 18", "It prints 12", "It stops with an IndexError", "It stops with a SyntaxError"], "answer": 2}
--- description
```python
scores = [4, 8, 6]
total = 0
for i in range(len(scores) + 1):
    total = total + scores[i]
print(total)
```

What happens when this program runs?
--- hints
- `len(scores)` is 3. Which values does `i` take?
- What are the valid indexes for a list of three items?
--- explanation
`range(len(scores) + 1)` is `range(4)`, which produces 0, 1, 2 and 3.

The list only has indexes 0, 1 and 2. When `i` reaches 3, `scores[3]` does not exist and Python stops with an **IndexError**. The `print` is never reached.

The loop should be `range(len(scores))`.
