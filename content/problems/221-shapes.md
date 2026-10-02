--- meta
{
  "title": "Shapes and Inheritance", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Inheritance", "points": 25, "track": "oop", "specRef": "1.2.4",
  "functionName": "Rectangle",
  "tests": [
    { "steps": [["Rectangle", 3, 4], ["area"], ["perimeter"], ["describe"]], "expected": [12, 14, "Rectangle with area 12"] },
    { "steps": [["Square", 5], ["area"], ["perimeter"], ["describe"]], "expected": [25, 20, "Square with area 25"] },
    { "steps": [["Shape", "Blob"], ["area"], ["describe"]], "expected": [0, "Blob with area 0"] },
    { "steps": [["Rectangle", 1, 1], ["describe"]], "expected": ["Rectangle with area 1"], "hidden": true },
    { "steps": [["Square", 1], ["area"], ["describe"]], "expected": [1, "Square with area 1"], "hidden": true },
    { "steps": [["Rectangle", 10, 2], ["perimeter"], ["area"]], "expected": [24, 20], "hidden": true },
    { "steps": [["Square", 12], ["perimeter"], ["describe"]], "expected": [48, "Square with area 144"], "hidden": true }
  ]
}
--- description
**Inheritance** lets a class reuse the attributes and methods of a parent class, and **override** the ones that need to behave differently.

The class `Shape` is written for you. Its `describe()` method calls `self.area()`, so any subclass that overrides `area()` gets a correct description for free. That is **polymorphism**.

Complete two subclasses:

**`Rectangle(Shape)`**, created with `Rectangle(width, height)`
- its name is `"Rectangle"`
- `area()` returns width × height
- `perimeter()` returns the distance all the way round

**`Square(Rectangle)`**, created with `Square(side)`
- its name is `"Square"`
- it should not need its own `area()` or `perimeter()`: it inherits them

Do not change `Shape`.

### Example

```python
square = Square(5)
square.area()        # 25
square.perimeter()   # 20
square.describe()    # "Square with area 25"
```
--- hints
- `super().__init__("Rectangle")` runs the parent's constructor, which sets `self.name`. Then store the width and the height.
- A square is a rectangle whose width and height are both `side`: call `super().__init__(side, side)`, then set `self.name` to `"Square"`.
--- starter
class Shape:
    def __init__(self, name):
        self.name = name

    def area(self):
        return 0

    def describe(self):
        return self.name + " with area " + str(self.area())


class Rectangle(Shape):
    def __init__(self, width, height):
        # Write your code here
        pass


class Square(Rectangle):
    def __init__(self, side):
        # Write your code here
        pass
--- solution
class Shape:
    def __init__(self, name):
        self.name = name

    def area(self):
        return 0

    def describe(self):
        return self.name + " with area " + str(self.area())


class Rectangle(Shape):
    def __init__(self, width, height):
        super().__init__("Rectangle")
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
        self.name = "Square"
