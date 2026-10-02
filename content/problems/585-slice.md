--- meta
{"title": "Slicing", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["ROG", "OGR", "OGRA", "GRA"], "answer": 1}
--- description
```python
word = "PROGRAM"
print(word[2:5])
```

What does this program print?
--- hints
- The first character is at index 0.
- A slice `[2:5]` starts at index 2 and stops **before** index 5.
--- explanation
Number the characters from 0: `P`=0, `R`=1, `O`=2, `G`=3, `R`=4, `A`=5, `M`=6.

`word[2:5]` takes indexes 2, 3 and 4, stopping before 5: **OGR**.
