--- meta
{"contest": "winter-cracker", "title": "Trace: a rolling snowball", "kind": "PUZZLE", "style": "TRACE", "difficulty": "EASY", "topic": "Trace tables", "points": 10, "track": "basics", "specRef": "2.2.1", "options": {"columns": ["size", "rolls", "output"], "rows": [["3", "0", ""], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["3", "0", ""], ["6", "1", ""], ["12", "2", ""], ["24", "3", ""], ["48", "4", ""], ["96", "5", ""], ["96", "5", "5"]]}
--- description
```python
size = 3
rolls = 0
while size < 50:
    size = size * 2
    rolls = rolls + 1
print(rolls)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, and the last row shows what it prints at the end. Write a value in every box, even if it has not changed.
--- hints
- The size doubles each time round.
- The condition is checked before each time round: once the size is 50 or more, the loop stops.
--- explanation
The size doubles 3, 6, 12, 24, 48. 48 is still under 50, so it rolls once more, to 96, and then the loop stops. It prints `5`.
