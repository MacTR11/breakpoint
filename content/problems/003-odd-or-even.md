--- meta
{"title": "Odd or even", "kind": "CODE", "difficulty": "EASY", "topic": "Selection", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "is_even",
  "tests": [
    {"args": [4], "expected": true},
    {"args": [7], "expected": false},
    {"args": [0], "expected": true},
    {"args": [101], "expected": false, "hidden": true},
    {"args": [-2], "expected": true, "hidden": true},
    {"args": [-9], "expected": false, "hidden": true}
  ]
}
--- description
`is_even(n)` should return `True` if `n` is an even number and `False` if it is odd.

For example, `is_even(4)` returns `True` and `is_even(7)` returns `False`.
--- hints
- `n % 2` is the remainder when `n` is divided by 2. For an even number that remainder is 0.
- You can return the comparison itself: `return n % 2 == 0`.
--- starter
def is_even(n):
    return True
--- solution
def is_even(n):
    return n % 2 == 0
