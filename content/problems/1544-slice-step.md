--- meta
{"title": "A slice with a step", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Slicing", "points": 5, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["eko", "ekon", "ea", "rap"], "answer": 0}
--- description
```python
word = "breakpoint"
print(word[2:7:2])
```

What does this program print?
--- hints
- `[2:7:2]` starts at index 2, stops **before** index 7, and goes up in steps of 2.
- Number the letters from 0: b r e a k p o i n t.
--- explanation
The slice takes indexes 2, 4 and 6 (it stops before 7): `e`, `k` and `o`. So it prints `eko`.
