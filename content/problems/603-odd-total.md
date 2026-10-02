--- meta
{ "title": "What Does It Print?", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Tracing", "points": 5, "track": "basics", "specRef": "2.2.1", "contest": "welcome",
  "options": ["6", "9", "15", "25"], "answer": 1 }
--- description
```python
total = 0
for i in range(1, 6):
    if i % 2 == 1:
        total += i
print(total)
```

What does this program print?
--- hints
- `range(1, 6)` produces 1, 2, 3, 4, 5. It stops **before** 6.
- `i % 2 == 1` is true for odd numbers only.
--- explanation
`range(1, 6)` gives 1, 2, 3, 4 and 5. The `if` only lets odd values through, so the program adds 1 + 3 + 5 = **9**.

15 would be the total of all five numbers, and 6 the total of the even ones.
