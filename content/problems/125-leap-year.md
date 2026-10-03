--- meta
{"title": "Leap year", "kind": "CODE", "difficulty": "EASY", "topic": "Selection", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "leap_year", "banned": ["import"],
  "tests": [
    {"args": [2024], "expected": true},
    {"args": [2023], "expected": false},
    {"args": [1900], "expected": false},
    {"args": [2000], "expected": true, "hidden": true},
    {"args": [2100], "expected": false, "hidden": true},
    {"args": [1996], "expected": true, "hidden": true},
    {"args": [2001], "expected": false, "hidden": true}
  ]
}
--- description
Write a function `leap_year(year)` that returns `True` if `year` is a leap year and `False` otherwise.

- A year that divides by 4 is a leap year…
- …unless it also divides by 100, in which case it is not…
- …unless it also divides by 400, in which case it is.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `leap_year(2024)` | `True` | divides by 4 |
| `leap_year(1900)` | `False` | divides by 100 but not by 400 |
| `leap_year(2023)` | `False` | |
--- hints
- `year % 4 == 0` is `True` when the year divides exactly by 4.
- Test the most specific rule first: divisible by 400, then by 100, then by 4.
--- starter
def leap_year(year):
    # Write your code here
    pass
--- solution
def leap_year(year):
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    return year % 4 == 0
