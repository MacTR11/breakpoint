--- meta
{"title": "Denary to binary, recursively", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 25, "track": "recursion", "specRef": "2.2.1", "functionName": "to_binary", "banned": ["bin(", "format(", "for ", "while "],
  "tests": [
    {"args": [11], "expected": "1011"},
    {"args": [0], "expected": "0"},
    {"args": [1], "expected": "1"},
    {"args": [8], "expected": "1000", "hidden": true},
    {"args": [255], "expected": "11111111", "hidden": true},
    {"args": [6], "expected": "110", "hidden": true}
  ]
}
--- description
Write a **recursive** function `to_binary(n)` that returns the binary form of the whole number `n` (0 or more) as a string.

For example, `to_binary(11)` returns `"1011"` and `to_binary(0)` returns `"0"`.

Do not use a loop, `bin` or `format`.
--- hints
- The last binary digit of `n` is `n % 2`. The digits before it are the binary form of `n // 2`.
- Stop when `n` is 0 or 1: its binary form is just `str(n)`. Otherwise return `to_binary(n // 2) + str(n % 2)`.
--- starter
def to_binary(n):
    pass
--- solution
def to_binary(n):
    if n < 2:
        return str(n)
    return to_binary(n // 2) + str(n % 2)
