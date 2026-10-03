--- meta
{"title": "Fractions", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Classes", "points": 25, "track": "oop", "specRef": "1.2.4", "functionName": "Fraction",
  "tests": [
    {"steps": [["Fraction", 1, 2], ["text"], ["add", 1, 3], ["text"]], "expected": ["1/2", null, "5/6"]},
    {"steps": [["Fraction", 2, 4], ["text"], ["multiply", 2, 3], ["text"]], "expected": ["1/2", null, "1/3"]},
    {"steps": [["Fraction", 3, 4], ["add", 1, 4], ["text"], ["value"]], "expected": [null, "1", 1.0], "hidden": true},
    {"steps": [["Fraction", 5, 1], ["text"], ["multiply", 1, 10], ["text"], ["add", 3, 2], ["text"]], "expected": ["5", null, "1/2", null, "2"], "hidden": true},
    {"steps": [["Fraction", 0, 7], ["text"], ["add", 0, 3], ["text"]], "expected": ["0", null, "0"], "hidden": true}
  ]
}
--- description
Write the class `Fraction` for fractions with positive whole-number tops and bottoms (the top may be 0). It has:

- a constructor `Fraction(top, bottom)`
- `add(top, bottom)`, which adds `top/bottom` to the fraction (it returns nothing)
- `multiply(top, bottom)`, which multiplies the fraction by `top/bottom`
- `text()`, which returns the fraction in its **simplest form** as a string, such as `"5/6"`. A whole number is shown without a bottom: `"5"`, and zero as `"0"`.
- `value()`, which returns the fraction as a decimal.

For example, a `Fraction(1, 2)` that has `1/3` added shows `"5/6"`.
--- hints
- a/b + c/d is (a×d + c×b) / (b×d), and a/b × c/d is (a×c) / (b×d).
- To simplify, divide the top and bottom by their greatest common divisor. Python has `math.gcd`, or you can write Euclid's algorithm.
- In `text`, after simplifying, a bottom of 1 means a whole number.
--- starter
class Fraction:
    def __init__(self, top, bottom):
        pass
--- solution
from math import gcd

class Fraction:
    def __init__(self, top, bottom):
        self.top = top
        self.bottom = bottom

    def add(self, top, bottom):
        self.top = self.top * bottom + top * self.bottom
        self.bottom = self.bottom * bottom

    def multiply(self, top, bottom):
        self.top = self.top * top
        self.bottom = self.bottom * bottom

    def text(self):
        common = gcd(self.top, self.bottom)
        top = self.top // common
        bottom = self.bottom // common
        if bottom == 1:
            return str(top)
        return str(top) + "/" + str(bottom)

    def value(self):
        return self.top / self.bottom
