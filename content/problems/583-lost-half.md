--- meta
{"title": "Where did the half go?", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Integer division", "points": 5, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["3", "3.5", "4", "7"], "answer": 0}
--- description
```python
marks = [3, 4]
average = sum(marks) // len(marks)
print(average)
```

What does this program print?
--- hints
- `//` and `/` are different operators.
--- explanation
`sum(marks)` is 7 and `len(marks)` is 2. The `//` operator is **integer division**: it divides and throws away the fractional part, so `7 // 2` is **3**.

The student wanted `/`, which gives 3.5. The program does not crash, so this is a logic error.
