--- meta
{"title": "Trace: a binary search", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "searching", "specRef": "2.3.1", "options": {"columns": ["low", "high", "mid", "found"], "rows": [["0", "6", "", "-1"], [null, null, null, null], [null, null, null, null], [null, null, null, null]]}, "answer": [["0", "6", "", "-1"], ["4", "6", "3", "-1"], ["4", "4", "5", "-1"], ["4", "4", "4", "4"]]}
--- description
```python
items = [3, 8, 12, 17, 21, 30, 42]
target = 21
low = 0
high = len(items) - 1
found = -1
while low <= high and found == -1:
    mid = (low + high) // 2
    if items[mid] == target:
        found = mid
    elif items[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop. Write a value in every box, even if it has not changed.
--- hints
- `mid` is `(low + high) // 2`: the middle index, rounded down.
- If the middle item is smaller than the target, `low` moves to `mid + 1`; if it is bigger, `high` moves to `mid - 1`.
--- explanation
- `low` 0, `high` 6: `mid` is 3. `items[3]` is 17, smaller than 21, so `low` becomes 4.
- `low` 4, `high` 6: `mid` is 5. `items[5]` is 30, bigger, so `high` becomes 4.
- `low` 4, `high` 4: `mid` is 4. `items[4]` is 21, so `found` becomes 4.

Three items looked at, out of seven.
