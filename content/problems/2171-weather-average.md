--- meta
{"title": "Weather station (a): the average reading", "kind": "CODE", "difficulty": "EASY", "topic": "Arrays", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "average",
  "tests": [
    {"args": [[12.0, 14.5, null, 13.5]], "expected": 13.3},
    {"args": [[10]], "expected": 10.0},
    {"args": [[null, null]], "expected": null},
    {"args": [[]], "expected": null, "hidden": true},
    {"args": [[-2.5, 2.5, null, 5.0]], "expected": 1.7, "hidden": true},
    {"args": [[1, 2, 2]], "expected": 1.7, "hidden": true}
  ]
}
--- description
A school weather station takes a temperature reading every hour and stores the readings in an array. If the sensor fails, the reading is stored as `None`.

Write the function `average(readings)`, which returns the mean of the readings that are not `None`, rounded to 1 decimal place. If there are no readings at all, it returns `None`.

For example, `average([12.0, 14.5, None, 13.5])` returns `13.3`.

**[4 marks]**
--- hints
- Add up the readings that are not `None`, and count them as you go.
- If the count is 0, return `None` before dividing. Otherwise return `round(total / count, 1)`.
--- starter
def average(readings):
    pass
--- solution
def average(readings):
    total = 0
    count = 0
    for reading in readings:
        if reading is not None:
            total = total + reading
            count = count + 1
    if count == 0:
        return None
    return round(total / count, 1)
--- explanation
One mark each, up to 4:

- Skips the missing (`None`) readings.
- Adds up and counts the readings that are there.
- Returns `None` when there are none, without dividing by zero.
- Divides and rounds to 1 decimal place.
