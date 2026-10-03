--- meta
{"title": "Adding remainders", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Tracing loops", "points": 5, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["3", "7", "2", "4"], "answer": 0}
--- description
```python
total = 0
n = 7
while n > 0:
    total = total + n % 3
    n = n // 3
print(total)
```

What does this program print?
--- hints
- Trace it: write down `n`, `n % 3` and `total` each time round the loop.
- `7 // 3` is 2, and `2 // 3` is 0, which ends the loop.
--- explanation
| `n` | `n % 3` | `total` |
| --- | --- | --- |
| 7 | 1 | 1 |
| 2 | 2 | 3 |
| 0 | | loop ends |

It prints `3`. (It is adding up the digits of 7 written in base 3, which is `21`.)
