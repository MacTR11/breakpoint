--- meta
{"title": "Fix: temperature", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Order of operations", "points": 10, "track": "debugging", "specRef": "3.3", "contest": "python-sprint", "functionName": "to_fahrenheit",
  "tests": [
    {"args": [100], "expected": 212.0},
    {"args": [0], "expected": 32.0},
    {"args": [-40], "expected": -40.0},
    {"args": [37], "expected": 98.6, "hidden": true},
    {"args": [10], "expected": 50.0, "hidden": true}
  ]
}
--- description
`to_fahrenheit(celsius)` should convert a temperature using the rule: multiply by 9, divide by 5, then add 32.

So 100 °C is 212 °F. The function gives a very different answer.

Fix the code in the editor so that every test passes.
--- hints
- Brackets are worked out first. What is being added to 32 in this code?
--- starter
def to_fahrenheit(celsius):
    return celsius * (9 / 5 + 32)
--- solution
def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32
