--- meta
{"title": "Trace: a running total", "kind": "PUZZLE", "style": "TRACE", "difficulty": "EASY", "topic": "Trace tables", "points": 10, "track": "basics", "specRef": "2.2.1", "options": {"columns": ["n", "total", "count", "output"], "rows": [["", "0", "0", ""], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]}, "answer": [["", "0", "0", ""], ["4", "4", "1", ""], ["7", "11", "2", ""], ["2", "13", "3", ""], ["9", "22", "4", ""], ["9", "22", "4", "5.5"]]}
--- description
```python
total = 0
count = 0
for n in [4, 7, 2, 9]:
    total = total + n
    count = count + 1
print(total / count)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, and the last row shows what it prints at the end. Write a value in every box, even if it has not changed.
--- hints
- `n` takes each value in the list in turn: 4, then 7, then 2, then 9.
- The output only appears once the loop has finished: 22 divided by 4.
--- explanation
`total` adds each number in turn: 4, 11, 13, 22. `count` counts the times round the loop: 1 to 4. After the loop `n` still holds 9, and the program prints `22 / 4`, which is `5.5` (`/` always gives a decimal).
