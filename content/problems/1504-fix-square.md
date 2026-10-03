--- meta
{"title": "Fix: a square that forgot its parent", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Inheritance", "points": 20, "track": "debugging", "specRef": "1.2.4", "functionName": "Square",
  "tests": [
    {"steps": [["Square", 3], ["area"], ["perimeter"]], "expected": [9, 12]},
    {"steps": [["Square", 1], ["area"], ["describe"]], "expected": [1, "Square with side 1"]},
    {"steps": [["Square", 10], ["describe"], ["perimeter"]], "expected": ["Square with side 10", 40], "hidden": true}
  ]
}
--- description
`Square` inherits from `Rectangle`. A square of side 3 should have an area of 9, a perimeter of 12, and `describe()` should return `"Square with side 3"`.

Creating a square currently crashes. There is **one** bug. Fix it without changing `Rectangle`.
--- hints
- Read the error: `Square` has no attribute `width`. Which method is supposed to create `width` and `height`?
- The square's constructor never runs the rectangle's constructor. Call it with `super().__init__(side, side)`.
--- starter
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


class Square(Rectangle):
    def __init__(self, side):
        self.side = side

    def describe(self):
        return "Square with side " + str(self.side)
--- solution
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
        self.side = side

    def describe(self):
        return "Square with side " + str(self.side)
