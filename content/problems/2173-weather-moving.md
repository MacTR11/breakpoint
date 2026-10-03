--- meta
{"title": "Weather station (c): smoothing the readings", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Arrays", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "moving_average",
  "tests": [
    {"args": [[10, 12, 14, 13, 11], 3], "expected": [12.0, 13.0, 12.7]},
    {"args": [[1, 2, 3], 1], "expected": [1.0, 2.0, 3.0]},
    {"args": [[1, 2], 3], "expected": []},
    {"args": [[4, 4, 4, 4], 2], "expected": [4.0, 4.0, 4.0], "hidden": true},
    {"args": [[2.5, 3.5, 4.5, 6], 2], "expected": [3.0, 4.0, 5.2], "hidden": true}
  ]
}
--- description
A school weather station takes a temperature reading every hour and stores the readings in an array. If the sensor fails, the reading is stored as `None`.

For this part there are no `None` readings. To smooth out noise, each reading can be replaced by the mean of a **window** of readings ending with it.

Write the function `moving_average(readings, window)`, which returns a new array of the mean of every run of `window` neighbouring readings, in order, each rounded to 1 decimal place. If there are fewer readings than the window, it returns an empty array.

For example, `moving_average([10, 12, 14, 13, 11], 3)` returns `[12.0, 13.0, 12.7]`.

**[6 marks]**
--- hints
- There are `len(readings) - window + 1` windows. The window starting at index `i` is `readings[i:i + window]`.
- For each window, divide its sum by `window` and round to 1 decimal place.
--- starter
def moving_average(readings, window):
    pass
--- solution
def moving_average(readings, window):
    result = []
    for i in range(len(readings) - window + 1):
        total = 0
        for reading in readings[i:i + window]:
            total = total + reading
        result.append(round(total / window, 1))
    return result
--- explanation
One mark each, up to 6:

- Loops over every starting position for a window.
- Stops so that no window goes past the end of the array.
- Adds up the readings in each window.
- Divides by the window size.
- Rounds each mean to 1 decimal place.
- Returns the means as a new array (empty when there are too few readings).
