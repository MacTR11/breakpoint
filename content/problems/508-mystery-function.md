--- meta
{ "title": "Mystery Function", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Tracing", "points": 10, "track": "basics", "specRef": "2.2.1",
  "options": ["4", "13", "2704", "4072"], "answer": 1 }
--- description
Read this function carefully.

```python
def mystery(n):
    total = 0
    while n > 0:
        total = total + n % 10
        n = n // 10
    return total
```

What does `mystery(4072)` return?
--- hints
- `n % 10` is the last digit of `n`. `n // 10` is `n` with its last digit removed.
- Draw a trace table with columns for `n` and `total`.
--- explanation
`n % 10` gives the last digit of `n`, and `n // 10` removes it. A trace table shows what happens:

| n | n % 10 | total |
| --- | --- | --- |
| 4072 | 2 | 2 |
| 407 | 7 | 9 |
| 40 | 0 | 9 |
| 4 | 4 | 13 |

The function adds up the digits: 4 + 0 + 7 + 2 = **13**.
