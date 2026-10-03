--- meta
{"title": "Rectangles", "kind": "CODE", "difficulty": "EASY", "topic": "Classes", "points": 10, "track": "oop", "specRef": "1.2.4", "functionName": "Rectangle",
  "tests": [
    {"steps": [["Rectangle", 3, 4], ["area"], ["perimeter"], ["is_square"]], "expected": [12, 14, false]},
    {"steps": [["Rectangle", 5, 5], ["is_square"], ["scale", 2], ["area"]], "expected": [true, null, 100]},
    {"steps": [["Rectangle", 1, 10], ["scale", 3], ["perimeter"], ["is_square"]], "expected": [null, 66, false], "hidden": true},
    {"steps": [["Rectangle", 2.5, 4], ["area"]], "expected": [10.0], "hidden": true}
  ]
}
--- description
Write the class `Rectangle` with:

- a constructor `Rectangle(width, height)`
- `area()` and `perimeter()`, which return those values
- `is_square()`, which returns `True` when the width and height are equal
- `scale(factor)`, which multiplies both the width and the height by `factor` (it returns nothing).
--- hints
- Keep `width` and `height` as attributes, set in the constructor.
- The perimeter is 2 × (width + height). `scale` changes the attributes, so `area()` afterwards uses the new sizes.
--- starter
class Rectangle:
    def __init__(self, width, height):
        pass
--- solution
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height

    def scale(self, factor):
        self.width = self.width * factor
        self.height = self.height * factor
