--- meta
{
  "title": "Is It a Real Date?", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 20, "track": "robust", "specRef": "3.3",
  "functionName": "valid_date", "banned": ["import"],
  "tests": [
    { "args": [29, 2, 2024], "expected": true },
    { "args": [29, 2, 2023], "expected": false },
    { "args": [31, 4, 2025], "expected": false },
    { "args": [31, 12, 1999], "expected": true, "hidden": true },
    { "args": [0, 1, 2020], "expected": false, "hidden": true },
    { "args": [1, 13, 2020], "expected": false, "hidden": true },
    { "args": [29, 2, 1900], "expected": false, "hidden": true },
    { "args": [29, 2, 2000], "expected": true, "hidden": true },
    { "args": [30, 4, 2025], "expected": true, "hidden": true },
    { "args": [31, 1, 2025], "expected": true, "hidden": true },
    { "args": [1, 0, 2025], "expected": false, "hidden": true },
    { "args": [32, 1, 2025], "expected": false, "hidden": true },
    { "args": [28, 2, 2023], "expected": true, "hidden": true }
  ]
}
--- description
A format check can confirm that a date *looks* right, but `31/04/2025` looks right and does not exist.

Write a function `valid_date(day, month, year)` that returns `True` if the three integers make a real date and `False` otherwise.

- April, June, September and November have 30 days.
- February has 28 days, or 29 in a leap year.
- A year is a leap year if it divides by 4, **except** that years dividing by 100 are not leap years **unless** they also divide by 400. So 2000 and 2024 were leap years; 1900 and 2023 were not.

Write the logic yourself: importing a date library is not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `valid_date(29, 2, 2024)` | `True` |
| `valid_date(29, 2, 2023)` | `False` |
| `valid_date(31, 4, 2025)` | `False` |

The hidden tests include boundary values such as day 0, day 32 and month 13.
--- hints
- Reject a month outside 1 to 12, or a day below 1, first. Then you only need the number of days in that month.
- A year is a leap year when `year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`. A list of the 12 month lengths makes the final check one line.
--- starter
def valid_date(day, month, year):
    # Write your code here
    pass
--- solution
def valid_date(day, month, year):
    if month < 1 or month > 12 or day < 1:
        return False
    leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    days = [31, 29 if leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return day <= days[month - 1]
