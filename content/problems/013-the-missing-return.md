--- meta
{"title": "Fix: the missing return", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Functions", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "area",
  "tests": [
    {"args": [3, 4], "expected": 12},
    {"args": [5, 5], "expected": 25},
    {"args": [0, 9], "expected": 0},
    {"args": [10, 2], "expected": 20, "hidden": true},
    {"args": [1, 1], "expected": 1, "hidden": true},
    {"args": [2.5, 4], "expected": 10.0, "hidden": true}
  ]
}
--- description
`area(width, height)` should **return** the area of a rectangle.

The code in the editor works the area out and prints it, but the tests say it returned `None`. Fix it.
--- hints
- `print` shows a value on the screen. It does not hand the value back to whoever called the function.
- Change `print(width * height)` to `return width * height`.
--- starter
def area(width, height):
    print(width * height)
--- solution
def area(width, height):
    return width * height
