--- meta
{"title": "Rotating a byte", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Bitwise operations", "points": 25, "track": "bits", "specRef": "1.4.1", "functionName": "rotate_left",
  "tests": [
    {"args": [147, 1], "expected": 39},
    {"args": [128, 1], "expected": 1},
    {"args": [1, 8], "expected": 1},
    {"args": [240, 4], "expected": 15, "hidden": true},
    {"args": [0, 3], "expected": 0, "hidden": true},
    {"args": [85, 3], "expected": 170, "hidden": true}
  ]
}
--- description
Rotating a byte left moves every bit one place left, and the bit that falls off the left end comes back in on the right. Write the function `rotate_left(n, k)`, which rotates the 8-bit value `n` (0 to 255) left by `k` places and returns the result.

For example, rotating `10010011` (147) left by 1 gives `00100111` (39).
--- hints
- Shifting left with `<<` can push bits past 8; mask them off with `& 255`.
- The bits that fell off are `n >> (8 - k)`. OR them back in: `((n << k) | (n >> (8 - k))) & 255`. Take `k % 8` first.
--- starter
def rotate_left(n, k):
    pass
--- solution
def rotate_left(n, k):
    k = k % 8
    return ((n << k) | (n >> (8 - k))) & 255
