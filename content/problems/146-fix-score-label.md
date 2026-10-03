--- meta
{"title": "Fix: score label", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Type error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "label",
  "tests": [
    {"args": ["Sam", 7], "expected": "Sam: 7"},
    {"args": ["Jo", 0], "expected": "Jo: 0"},
    {"args": ["", 12], "expected": ": 12"},
    {"args": ["Al", -3], "expected": "Al: -3", "hidden": true},
    {"args": ["Kim", 100], "expected": "Kim: 100", "hidden": true}
  ]
}
--- description
`label(name, score)` takes a name (a string) and a score (an integer) and should return them joined like this: `"Sam: 7"`.

At the moment it crashes.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Read the error message in the results. It tells you which two types Python refused to join together.
- `+` can join a string to a string, but not a string to a number. `str(score)` converts the number first.
--- starter
def label(name, score):
    return name + ": " + score
--- solution
def label(name, score):
    return name + ": " + str(score)
