--- meta
{"title": "A swap with no spare variable", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Bitwise operations", "points": 20, "track": "bits", "specRef": "1.4.1", "check": "run", "options": ["9 5", "5 9", "12 12", "0 0"], "answer": 0}
--- description
```python
a = 5
b = 9
a = a ^ b
b = a ^ b
a = a ^ b
print(a, b)
```

`^` is bitwise exclusive or (XOR). What does this program print?
--- hints
- Work in binary: 5 is `0101` and 9 is `1001`.
- XOR gives 1 where the bits differ. A useful fact: `x ^ y ^ y` is `x`.
--- explanation
- `a = 5 ^ 9` = `0101 ^ 1001` = `1100` (12).
- `b = 12 ^ 9` = `1100 ^ 1001` = `0101` (5): the original `a`.
- `a = 12 ^ 5` = `1100 ^ 0101` = `1001` (9): the original `b`.

The values have swapped, so it prints `9 5`. It is a neat trick, but `a, b = b, a` is clearer.
