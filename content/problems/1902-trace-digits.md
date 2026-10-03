--- meta
{"title": "Trace: taking a number apart", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "basics", "specRef": "2.2.1", "options": {"columns": ["n", "total", "digits", "output"], "rows": [["2047", "0", "0", ""], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]}, "answer": [["2047", "0", "0", ""], ["204", "7", "1", ""], ["20", "11", "2", ""], ["2", "11", "3", ""], ["0", "13", "4", ""], ["0", "13", "4", "4 13"]]}
--- description
```python
n = 2047
digits = 0
total = 0
while n > 0:
    total = total + n % 10
    n = n // 10
    digits = digits + 1
print(digits, total)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, and the last row shows what it prints at the end. Write a value in every box, even if it has not changed.
--- hints
- `n % 10` is the last digit of `n`, and `n // 10` is `n` with its last digit removed.
- The loop stops as soon as `n` reaches 0.
--- explanation
Each time round, the last digit is added to `total` and removed from `n`: 7, then 4, then 0, then 2. `n` goes 204, 20, 2, 0, and the loop stops. It prints `4 13`: four digits, adding up to 13.
