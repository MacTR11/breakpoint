--- meta
{"title": "Trace: adding up a grid", "kind": "PUZZLE", "style": "TRACE", "difficulty": "HARD", "topic": "Trace tables", "points": 25, "track": "lists", "specRef": "2.2.1", "options": {"columns": ["row", "value", "total", "output"], "rows": [["", "", "0", ""], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]}, "answer": [["", "", "0", ""], ["[1, 2]", "1", "1", ""], ["[1, 2]", "2", "5", ""], ["[3, 4]", "3", "14", ""], ["[3, 4]", "4", "30", ""], ["[3, 4]", "4", "30", "30"]]}
--- description
```python
grid = [[1, 2], [3, 4]]
total = 0
for row in grid:
    for value in row:
        total = total + value * value
print(total)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop (here, the inner loop), and the last row shows what it prints at the end. Write a value in every box, even if it has not changed.
--- hints
- The outer loop takes each row in turn; for each one, the inner loop takes each value in that row.
- Each value is squared before it is added.
--- explanation
The inner loop runs four times in all: 1, 2 from the first row, then 3, 4 from the second. The squares add up 1, 5, 14, 30, and it prints `30`.
