--- meta
{"title": "What Kind of Triangle?", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Selection", "points": 20, "track": "basics", "specRef": "2.2.1", "functionName": "triangle_type",
  "tests": [
    {"args": [3, 3, 3], "expected": "equilateral"},
    {"args": [3, 4, 4], "expected": "isosceles"},
    {"args": [3, 4, 5], "expected": "scalene"},
    {"args": [1, 2, 3], "expected": "invalid"},
    {"args": [0, 1, 1], "expected": "invalid", "hidden": true},
    {"args": [5, 5, 8], "expected": "isosceles", "hidden": true},
    {"args": [2, 2, 5], "expected": "invalid", "hidden": true},
    {"args": [7, 10, 5], "expected": "scalene", "hidden": true},
    {"args": [10, 1, 1], "expected": "invalid", "hidden": true},
    {"args": [4, 8, 4], "expected": "invalid", "hidden": true},
    {"args": [6, 5, 6], "expected": "isosceles", "hidden": true}
  ]
}
--- description
Write a function `triangle_type(a, b, c)` that takes the lengths of three sides and returns one of four strings:

- `"invalid"` if the sides cannot make a triangle: any side is zero or less, or the longest side is not **shorter** than the other two added together
- `"equilateral"` if all three sides are equal
- `"isosceles"` if exactly two sides are equal
- `"scalene"` if all three are different.

### Examples

| Call | Returns |
| --- | --- |
| `triangle_type(3, 3, 3)` | `"equilateral"` |
| `triangle_type(3, 4, 4)` | `"isosceles"` |
| `triangle_type(3, 4, 5)` | `"scalene"` |
| `triangle_type(1, 2, 3)` | `"invalid"` |
--- hints
- Check for an invalid triangle first, so the other tests can assume the sides are sensible.
- The longest side is `max(a, b, c)`, and the other two add up to `a + b + c` minus the longest.
--- starter
def triangle_type(a, b, c):
    # Write your code here
    pass
--- solution
def triangle_type(a, b, c):
    longest = max(a, b, c)
    if min(a, b, c) <= 0 or longest >= a + b + c - longest:
        return "invalid"
    if a == b and b == c:
        return "equilateral"
    if a == b or b == c or a == c:
        return "isosceles"
    return "scalene"
