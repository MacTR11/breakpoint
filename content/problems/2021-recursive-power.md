--- meta
{"title": "Recursion (a): raise to a power", "kind": "CODE", "difficulty": "EASY", "topic": "Recursion", "points": 10, "track": "exam", "specRef": "2.2.1", "functionName": "power", "banned": ["**", "pow(", "for ", "while "],
  "tests": [
    {"args": [2, 5], "expected": 32},
    {"args": [7, 0], "expected": 1},
    {"args": [3, 3], "expected": 27},
    {"args": [10, 1], "expected": 10, "hidden": true},
    {"args": [1, 50], "expected": 1, "hidden": true},
    {"args": [5, 4], "expected": 625, "hidden": true},
    {"args": [0, 3], "expected": 0, "hidden": true}
  ]
}
--- description
Write a **recursive** function `power(base, exponent)` that returns `base` raised to the power `exponent`.

`exponent` is a whole number, 0 or greater. Any number to the power 0 is 1.

Do not use a loop, `**` or `pow`.

**[4 marks]**
--- hints
- The base case is `exponent == 0`, which returns 1.
- Otherwise the answer is `base` multiplied by `base` to the power of one less: `base * power(base, exponent - 1)`.
--- starter
def power(base, exponent):
    pass
--- solution
def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)
--- explanation
One mark each, up to 4:

- A base case that tests for an exponent of 0.
- The base case returns 1.
- A recursive call with the exponent reduced by 1, so the calls move towards the base case.
- The result of that call is multiplied by `base` and returned.
