--- meta
{"title": "Trace: a linear search", "kind": "PUZZLE", "style": "TRACE", "difficulty": "EASY", "topic": "Trace tables", "points": 10, "track": "searching", "specRef": "2.3.1", "options": {"columns": ["i", "found", "output"], "rows": [["0", "-1", ""], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["0", "-1", ""], ["1", "-1", ""], ["2", "-1", ""], ["3", "2", ""], ["3", "2", "2"]]}
--- description
```python
items = [8, 3, 5, 9]
target = 5
found = -1
i = 0
while i < len(items) and found == -1:
    if items[i] == target:
        found = i
    i = i + 1
print(found)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, and the last row shows what it prints at the end. Write a value in every box, even if it has not changed.
--- hints
- `i` goes up by 1 every time round, whether or not the item matched.
- The loop stops when `found` is no longer -1, even though `i` has not reached the end.
--- explanation
The search looks at index 0 (8), then 1 (3), then 2 (5), which matches, so `found` becomes 2. `i` still goes up to 3 at the end of that time round, and then the loop stops because `found` is no longer -1. It prints `2`.
