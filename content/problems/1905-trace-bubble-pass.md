--- meta
{"title": "Trace: one pass of a bubble sort", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "sorting", "specRef": "2.3.1", "options": {"columns": ["i", "items", "swaps"], "rows": [["", "[5, 1, 4, 2]", "0"], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "[5, 1, 4, 2]", "0"], ["0", "[1, 5, 4, 2]", "1"], ["1", "[1, 4, 5, 2]", "2"], ["2", "[1, 4, 2, 5]", "3"]]}
--- description
```python
items = [5, 1, 4, 2]
swaps = 0
for i in range(len(items) - 1):
    if items[i] > items[i + 1]:
        items[i], items[i + 1] = items[i + 1], items[i]
        swaps = swaps + 1
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop. Write the list as Python would print it, such as `[1, 5, 4, 2]`. Write a value in every box, even if it has not changed.
--- hints
- Compare `items[i]` with the item after it, and swap them if the first is bigger.
- Write out the whole list after each comparison, swapped or not.
--- explanation
- `i` = 0: 5 > 1, swap: `[1, 5, 4, 2]`.
- `i` = 1: 5 > 4, swap: `[1, 4, 5, 2]`.
- `i` = 2: 5 > 2, swap: `[1, 4, 2, 5]`.

Three swaps. After one pass the largest item, 5, has bubbled to the end.
