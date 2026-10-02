--- meta
{"title": "DIV and MOD", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Arithmetic", "points": 5, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["3 2", "3.4 2", "2 3", "3 5"], "answer": 0}
--- description
```python
print(17 // 5, 17 % 5)
```

What does this program print?
--- hints
- `//` is integer division (DIV): how many whole times does 5 go into 17?
- `%` is the remainder (MOD).
--- explanation
5 goes into 17 three whole times (5 × 3 = 15), with 2 left over.

`17 // 5` is **3** and `17 % 5` is **2**.
