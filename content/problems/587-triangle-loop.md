--- meta
{"title": "Counting Iterations", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Nested loops", "points": 10, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["3", "5", "6", "9"], "answer": 2}
--- description
```python
count = 0
for i in range(3):
    for j in range(i, 3):
        count += 1
print(count)
```

What does this program print?
--- hints
- The inner loop starts at `i`, not at 0, so it gets shorter each time.
- Count the inner loop's runs separately for `i = 0`, `i = 1` and `i = 2`.
--- explanation
The inner loop runs from `i` up to 2:

- `i = 0`: `j` is 0, 1, 2, so 3 runs
- `i = 1`: `j` is 1, 2, so 2 runs
- `i = 2`: `j` is 2, so 1 run

3 + 2 + 1 = **6**. This shrinking pattern is exactly how bubble sort avoids re-checking items that are already in place.
