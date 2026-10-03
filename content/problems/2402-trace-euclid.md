--- meta
{"contest": "trace-race", "title": "Trace: Euclid's algorithm", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "basics", "specRef": "2.2.1", "options": {"columns": ["a", "b", "r", "output"], "rows": [["84", "36", "", ""], [null, null, null, null], [null, null, null, null], [null, null, null, null]]}, "answer": [["84", "36", "", ""], ["36", "12", "12", ""], ["12", "0", "0", ""], ["12", "0", "0", "12"]]}
--- description
```python
a = 84
b = 36
while b != 0:
    r = a % b
    a = b
    b = r
print(a)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, and the last row shows what it prints at the end. Write a value in every box, even if it has not changed.
--- hints
- `a % b` is the remainder when a is divided by b: 84 % 36 is 12.
- Each time round, b moves into a and the remainder moves into b. The loop stops when b is 0.
--- explanation
- 84 % 36 is 12, so a becomes 36 and b becomes 12.
- 36 % 12 is 0, so a becomes 12 and b becomes 0, and the loop stops.

It prints `12`, the highest common factor of 84 and 36. This is Euclid's algorithm, over 2,000 years old and still the quickest way to do it.
