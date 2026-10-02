--- meta
{"title": "Fix: Triangle Area", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Name error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "triangle_area",
  "tests": [
    {"args": [4, 5], "expected": 10.0},
    {"args": [3, 3], "expected": 4.5},
    {"args": [0, 9], "expected": 0.0},
    {"args": [10, 1], "expected": 5.0, "hidden": true},
    {"args": [7, 2], "expected": 7.0, "hidden": true}
  ]
}
--- description
`triangle_area(base, height)` should return half of the base multiplied by the height.

It crashes with a runtime error.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- The error message names a variable that Python has never heard of. Read it letter by letter.
- A `NameError` usually means a spelling mistake. Compare the name in the calculation with the parameter in the first line.
--- starter
def triangle_area(base, height):
    area = base * hieght / 2
    return area
--- solution
def triangle_area(base, height):
    area = base * height / 2
    return area
