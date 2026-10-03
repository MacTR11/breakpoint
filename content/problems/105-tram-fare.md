--- meta
{
  "title": "Promenade tram fare",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Selection",
  "points": 10,
  "track": "basics", "specRef": "2.2.1",
  "functionName": "tram_fare",
  "tests": [
    { "args": [30, 5], "expected": 200 },
    { "args": [12, 8], "expected": 175 },
    { "args": [3, 10], "expected": 0 },
    { "args": [12, 4], "expected": 100, "hidden": true },
    { "args": [30, 6], "expected": 350, "hidden": true },
    { "args": [60, 9], "expected": 0, "hidden": true },
    { "args": [5, 1], "expected": 100, "hidden": true },
    { "args": [15, 6], "expected": 175, "hidden": true },
    { "args": [16, 6], "expected": 350, "hidden": true },
    { "args": [4, 6], "expected": 0, "hidden": true },
    { "args": [59, 2], "expected": 200, "hidden": true }
  ]
}
--- description
A seaside tram charges by the number of stops travelled:

- **1 to 5 stops:** 200p
- **6 or more stops:** 350p

Some passengers get a discount:

- Under 5 years old: **free**
- Aged 5 to 15 (inclusive): **half price**
- Aged 60 or over: **free**

Write a function `tram_fare(age, stops)` that returns the fare **in pence** as an integer.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `tram_fare(30, 5)` | `200` | adult, short journey |
| `tram_fare(12, 8)` | `175` | half of 350p |
| `tram_fare(3, 10)` | `0` | under 5 |
--- hints
- Work out the full fare first (200 or 350), then deal with the discounts.
- Check the free cases (`age < 5` or `age >= 60`) before the half-price case, and use `//` so the answer is a whole number.
--- starter
def tram_fare(age, stops):
    # Write your code here
    pass
--- solution
def tram_fare(age, stops):
    fare = 200 if stops <= 5 else 350
    if age < 5 or age >= 60:
        return 0
    if age <= 15:
        return fare // 2
    return fare
