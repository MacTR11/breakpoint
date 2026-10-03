--- meta
{"contest": "trace-race", "title": "Trace: an insertion sort", "kind": "PUZZLE", "style": "TRACE", "difficulty": "HARD", "topic": "Trace tables", "points": 25, "track": "sorting", "specRef": "2.3.1", "options": {"columns": ["i", "current", "j", "items"], "rows": [["", "", "", "[4, 1, 3, 2]"], [null, null, null, null], [null, null, null, null], [null, null, null, null]]}, "answer": [["", "", "", "[4, 1, 3, 2]"], ["1", "1", "-1", "[1, 4, 3, 2]"], ["2", "3", "0", "[1, 3, 4, 2]"], ["3", "2", "0", "[1, 2, 3, 4]"]]}
--- description
```python
items = [4, 1, 3, 2]
for i in range(1, len(items)):
    current = items[i]
    j = i - 1
    while j >= 0 and items[j] > current:
        items[j + 1] = items[j]
        j = j - 1
    items[j + 1] = current
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop (the outer loop). Write the list as Python would print it, such as `[1, 4, 3, 2]`. Write a value in every box, even if it has not changed.
--- hints
- `current` is the item being inserted. Bigger items before it move one place right while `j` steps left.
- The `while` stops when `j` reaches −1 or an item that is not bigger than `current`. The item goes in at `j + 1`.
--- explanation
- i = 1: current is 1. 4 moves right, j reaches −1, and 1 goes in at 0: `[1, 4, 3, 2]`.
- i = 2: current is 3. 4 moves right, and j stops at 0 because 1 is not bigger than 3: `[1, 3, 4, 2]`.
- i = 3: current is 2. 4 and 3 move right, j stops at 0: `[1, 2, 3, 4]`.
