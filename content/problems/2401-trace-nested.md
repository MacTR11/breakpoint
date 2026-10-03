--- meta
{"contest": "trace-race", "title": "Trace: loops inside loops", "kind": "PUZZLE", "style": "TRACE", "difficulty": "EASY", "topic": "Trace tables", "points": 10, "track": "basics", "specRef": "2.2.1", "options": {"columns": ["i", "j", "total"], "rows": [["", "", "0"], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "", "0"], ["1", "1", "1"], ["1", "2", "3"], ["1", "3", "6"], ["2", "1", "8"], ["2", "2", "12"], ["2", "3", "18"]]}
--- description
```python
total = 0
for i in range(1, 3):
    for j in range(1, 4):
        total = total + i * j
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop (here, the inner loop). Write a value in every box, even if it has not changed.
--- hints
- The inner loop runs all the way through, j = 1, 2, 3, for each value of i.
- `range(1, 3)` is 1 and 2: it stops before 3.
--- explanation
For i = 1, j goes 1, 2, 3, adding 1, 2 and 3: the total reaches 6. For i = 2, j goes 1, 2, 3 again, adding 2, 4 and 6: the total reaches 18. The inner loop body runs 2 × 3 = 6 times.
