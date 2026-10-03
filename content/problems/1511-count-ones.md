--- meta
{"title": "Counting the 1 bits", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Bitwise operations", "points": 25, "track": "bits", "specRef": "1.4.1", "functionName": "count_ones", "banned": ["bin(", "format(", ".count(", "str("],
  "tests": [
    {"args": [13], "expected": 3},
    {"args": [0], "expected": 0},
    {"args": [255], "expected": 8},
    {"args": [1024], "expected": 1, "hidden": true},
    {"args": [7], "expected": 3, "hidden": true},
    {"args": [1023], "expected": 10, "hidden": true},
    {"args": [170], "expected": 4, "hidden": true}
  ]
}
--- description
Write the function `count_ones(n)`, which returns how many 1s there are in the binary form of the whole number `n` (0 or more).

For example, 13 is `1101` in binary, so `count_ones(13)` returns `3`.

Use the bitwise operators: do not convert the number to a string.
--- hints
- `n & 1` is 1 when the last bit of `n` is 1, and 0 when it is 0.
- `n >> 1` shifts every bit one place right, dropping the last bit. Repeat until `n` is 0, adding up `n & 1` each time.
--- starter
def count_ones(n):
    pass
--- solution
def count_ones(n):
    ones = 0
    while n > 0:
        ones = ones + (n & 1)
        n = n >> 1
    return ones
