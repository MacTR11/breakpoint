--- meta
{"title": "Powers of two", "kind": "CODE", "difficulty": "EASY", "topic": "Bitwise operations", "points": 10, "track": "bits", "specRef": "1.4.1", "functionName": "is_power_of_two",
  "tests": [
    {"args": [8], "expected": true},
    {"args": [12], "expected": false},
    {"args": [1], "expected": true},
    {"args": [0], "expected": false, "hidden": true},
    {"args": [1024], "expected": true, "hidden": true},
    {"args": [1023], "expected": false, "hidden": true},
    {"args": [96], "expected": false, "hidden": true}
  ]
}
--- description
Write the function `is_power_of_two(n)`, which returns `True` if the whole number `n` is a power of two (1, 2, 4, 8, 16 and so on) and `False` otherwise. 0 is not a power of two.

For example, `is_power_of_two(8)` returns `True` and `is_power_of_two(12)` returns `False`.
--- hints
- A loop works: keep halving while `n` is even, and see whether you end at 1.
- There is a neat bitwise trick too. A power of two has exactly one 1 bit, and `n & (n - 1)` clears the lowest 1 bit, so for a power of two it gives 0.
--- starter
def is_power_of_two(n):
    pass
--- solution
def is_power_of_two(n):
    return n > 0 and n & (n - 1) == 0
