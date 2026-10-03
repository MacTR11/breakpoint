--- meta
{"title": "Trace: a queue", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "structures", "specRef": "1.4.2", "options": {"columns": ["n", "total", "queue"], "rows": [["", "0", "[3, 1]"], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "0", "[3, 1]"], ["3", "3", "[1, 1]"], ["1", "4", "[1]"], ["1", "5", "[]"]]}
--- description
```python
queue = [3, 1]
total = 0
while len(queue) > 0:
    n = queue.pop(0)
    total = total + n
    if n > 2:
        queue.append(n - 2)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop. Write the list as Python would print it, such as `[1, 1]`. Write a value in every box, even if it has not changed.
--- hints
- `pop(0)` takes the item from the front of the queue.
- Only numbers bigger than 2 put something back on the end.
--- explanation
- Take 3 from the front: `total` 3. 3 > 2, so 1 joins the back: `[1, 1]`.
- Take 1: `total` 4. `[1]`.
- Take 1: `total` 5. `[]`, and the loop stops.
