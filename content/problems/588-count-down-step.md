--- meta
{"title": "Range with a Step", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["10 7 4 1", "10 7 4", "9 6 3 0", "10 7 4 1 -2"], "answer": 0}
--- description
```python
for i in range(10, 0, -3):
    print(i)
```

Which numbers does this program print, in order?
--- hints
- `range(start, stop, step)` begins at `start` and changes by `step` each time.
- It stops before reaching `stop`: 0 itself is never produced.
--- explanation
The range starts at 10 and goes down in threes: 10, 7, 4, 1. The next value would be −2, which is past the stop value of 0, so the loop ends.

It prints **10 7 4 1**.
