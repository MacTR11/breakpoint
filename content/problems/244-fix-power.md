--- meta
{"title": "Fix: Base Case", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Recursion error", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "power", "banned": ["**", "pow("],
  "tests": [
    {"args": [2, 3], "expected": 8},
    {"args": [5, 0], "expected": 1},
    {"args": [7, 1], "expected": 7},
    {"args": [2, 10], "expected": 1024, "hidden": true},
    {"args": [1, 5], "expected": 1, "hidden": true},
    {"args": [0, 3], "expected": 0, "hidden": true},
    {"args": [3, 4], "expected": 81, "hidden": true}
  ]
}
--- description
`power(base, exponent)` should return `base` raised to the power `exponent`, using recursion. The exponent is a whole number of 0 or more, and anything to the power 0 is 1.

Every answer comes out as 0.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Trace `power(2, 1)`: it returns `2 * power(2, 0)`. What does `power(2, 0)` return?
- The base case is the value everything else gets multiplied by. Multiplying by 0 wipes out the whole answer.
--- starter
def power(base, exponent):
    if exponent == 0:
        return 0
    return base * power(base, exponent - 1)
--- solution
def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)
