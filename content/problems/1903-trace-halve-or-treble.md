--- meta
{"title": "Trace: halve or treble", "kind": "PUZZLE", "style": "TRACE", "difficulty": "EASY", "topic": "Trace tables", "points": 10, "track": "basics", "specRef": "2.2.1", "options": {"columns": ["x", "output"], "rows": [["6", ""], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]]}, "answer": [["6", ""], ["3", "3"], ["10", "10"], ["5", "5"], ["16", "16"], ["8", "8"], ["4", "4"], ["2", "2"], ["1", "1"]]}
--- description
```python
x = 6
while x != 1:
    if x % 2 == 0:
        x = x // 2
    else:
        x = 3 * x + 1
    print(x)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, including what it prints. Write a value in every box, even if it has not changed.
--- hints
- Even numbers are halved; odd numbers become three times the number plus one.
- The loop stops when `x` is 1, after printing it.
--- explanation
6 is even, so it halves to 3. 3 is odd: 3 × 3 + 1 = 10. Then 5, 16, 8, 4, 2 and 1. This is the Collatz sequence: nobody has ever found a starting number for which it does not reach 1.
