--- meta
{"title": "Fix: The Loop That Never Ends", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Infinite loop", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "count_digits",
  "tests": [
    {"args": [7], "expected": 1},
    {"args": [42], "expected": 2},
    {"args": [1000], "expected": 4},
    {"args": [9], "expected": 1, "hidden": true},
    {"args": [10], "expected": 2, "hidden": true},
    {"args": [123456], "expected": 6, "hidden": true}
  ]
}
--- description
`count_digits(n)` should return how many digits there are in the whole number `n`, which is always 1 or more.

When you run it, nothing comes back: the tests report that it is **too slow**. Something is missing.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- A `while` loop only stops when its condition becomes false. Does anything inside this loop ever change `n`?
- Each time round, one digit should be removed from `n`. `n // 10` is `n` without its last digit.
--- starter
def count_digits(n):
    count = 0
    while n > 0:
        count = count + 1
    return count
--- solution
def count_digits(n):
    count = 0
    while n > 0:
        count = count + 1
        n = n // 10
    return count
