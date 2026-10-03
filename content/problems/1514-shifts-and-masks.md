--- meta
{"title": "Shifts and masks", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Bitwise operations", "points": 10, "track": "bits", "specRef": "1.4.1", "check": "run", "options": ["6 4 15", "26 4 15", "6 6 13", "7 12 15"], "answer": 0}
--- description
```python
n = 13
print(n >> 1, n & 6, n | 2)
```

13 is `1101` in binary. What does this program print?
--- hints
- `>> 1` shifts right one place: `1101` becomes `110`.
- `&` keeps a bit only where both numbers have a 1. `|` sets a bit where either has a 1. 6 is `0110` and 2 is `0010`.
--- explanation
- `13 >> 1`: `1101` shifted right is `110`, which is 6.
- `13 & 6`: `1101 AND 0110` is `0100`, which is 4.
- `13 | 2`: `1101 OR 0010` is `1111`, which is 15.

So it prints `6 4 15`.
