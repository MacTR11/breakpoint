--- meta
{"title": "Fix: Old Enough to Vote", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Boundary error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "can_vote",
  "tests": [
    {"args": [18], "expected": true},
    {"args": [17], "expected": false},
    {"args": [30], "expected": true},
    {"args": [0], "expected": false, "hidden": true},
    {"args": [19], "expected": true, "hidden": true}
  ]
}
--- description
`can_vote(age)` should return `True` for anyone aged 18 **or over**, and `False` otherwise.

It contains **one** bug.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Which of the examples fails? What is special about that age?
- `>` means strictly greater than. An 18-year-old is not greater than 18.
--- starter
def can_vote(age):
    if age > 18:
        return True
    return False
--- solution
def can_vote(age):
    if age >= 18:
        return True
    return False
