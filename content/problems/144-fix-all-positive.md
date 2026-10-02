--- meta
{"title": "Fix: All Positive?", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Logic error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "all_positive",
  "tests": [
    {"args": [[1, 2, 3]], "expected": true},
    {"args": [[1, -2, 3]], "expected": false},
    {"args": [[]], "expected": true},
    {"args": [[5]], "expected": true, "hidden": true},
    {"args": [[0]], "expected": false, "hidden": true},
    {"args": [[3, 2, -1]], "expected": false, "hidden": true},
    {"args": [[-1, 5]], "expected": false, "hidden": true}
  ]
}
--- description
`all_positive(numbers)` should return `True` only if **every** number in the list is greater than zero. An empty list counts as `True`.

The function gives its answer too soon.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- How many numbers does the function look at before it returns? Trace `[1, -2, 3]` by hand.
- One negative number is enough to answer `False` straight away. But you can only answer `True` once the loop has checked them all.
--- starter
def all_positive(numbers):
    for number in numbers:
        if number > 0:
            return True
        else:
            return False
--- solution
def all_positive(numbers):
    for number in numbers:
        if number <= 0:
            return False
    return True
