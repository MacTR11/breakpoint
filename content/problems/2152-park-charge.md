--- meta
{"title": "Car park (b): work out the charge", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Selection and arithmetic", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "charge",
  "tests": [
    {"args": [20], "expected": 0},
    {"args": [30], "expected": 0},
    {"args": [31], "expected": 1.5},
    {"args": [90], "expected": 1.5},
    {"args": [91], "expected": 3.0, "hidden": true},
    {"args": [0], "expected": 0, "hidden": true},
    {"args": [600], "expected": 12, "hidden": true},
    {"args": [1000], "expected": 12, "hidden": true},
    {"args": [150], "expected": 3.0, "hidden": true}
  ]
}
--- description
A seafront car park records cars by their number plate. Plates are strings such as `"AB12 CDE"`: two capital letters, two digits, a space, then three capital letters.

The car park charges for each visit like this:

- the first 30 minutes are free
- after that, £1.50 for each hour or part of an hour
- no visit costs more than £12.

Write the function `charge(minutes)`, which returns the charge in pounds for a visit of `minutes` minutes. For example, 31 minutes costs `1.5` (one part-hour after the free 30), 90 minutes costs `1.5`, and 91 minutes costs `3.0`.

**[5 marks]**
--- hints
- Take the free 30 minutes off first. If nothing is left, the charge is 0.
- Count the started hours in what is left: whole hours, plus one more if there are minutes left over (`//` and `%` help). Multiply by 1.5, then cap at 12.
--- starter
def charge(minutes):
    pass
--- solution
def charge(minutes):
    paid = minutes - 30
    if paid <= 0:
        return 0
    hours = paid // 60
    if paid % 60 != 0:
        hours = hours + 1
    return min(hours * 1.5, 12)
--- explanation
One mark each, up to 5:

- Removes the free 30 minutes.
- Returns 0 for a visit of 30 minutes or less.
- Counts each started hour, rounding up a part hour.
- Multiplies by £1.50.
- Caps the charge at £12.
