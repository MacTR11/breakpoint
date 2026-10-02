--- meta
{"title": "Fix: Boundary Values", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Boundary error", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "valid_mark",
  "tests": [
    {"args": [50], "expected": true},
    {"args": [0], "expected": true},
    {"args": [100], "expected": true},
    {"args": [-1], "expected": false, "hidden": true},
    {"args": [101], "expected": false, "hidden": true},
    {"args": [1], "expected": true, "hidden": true},
    {"args": [99], "expected": true, "hidden": true}
  ]
}
--- description
`valid_mark(mark)` should return `True` for a mark from 0 to 100 **inclusive**, and `False` for anything outside that range.

Normal data passes. The boundary data does not.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Which marks does it get wrong? They are the two values right at the edges of the range.
- `<` excludes the boundary itself. `<=` includes it.
--- starter
def valid_mark(mark):
    return 0 < mark < 100
--- solution
def valid_mark(mark):
    return 0 <= mark <= 100
