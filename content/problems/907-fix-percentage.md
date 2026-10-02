--- meta
{"title": "Fix: Percentage Check", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Robust validation", "points": 20, "track": "debugging", "specRef": "3.3", "contest": "build-it-right", "functionName": "valid_percentage",
  "tests": [
    {"args": ["50"], "expected": true},
    {"args": ["abc"], "expected": false},
    {"args": ["150"], "expected": false},
    {"args": ["0"], "expected": true, "hidden": true},
    {"args": ["100"], "expected": true, "hidden": true},
    {"args": ["-1"], "expected": false, "hidden": true},
    {"args": [""], "expected": false, "hidden": true},
    {"args": ["12.5"], "expected": false, "hidden": true}
  ]
}
--- description
`valid_percentage(text)` is given what a user typed. It should return `True` if that is a whole number from 0 to 100 inclusive, and `False` for **anything** else. It must never crash.

There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- `int("abc")` raises a `ValueError`. Wrap the conversion in `try` / `except ValueError` and return `False` when it fails.
- `value >= 0 or value <= 100` is true for every number there is. Both conditions need to hold.
--- starter
def valid_percentage(text):
    value = int(text)
    if value >= 0 or value <= 100:
        return True
    return False
--- solution
def valid_percentage(text):
    try:
        value = int(text)
    except ValueError:
        return False
    if value >= 0 and value <= 100:
        return True
    return False
