--- meta
{"title": "Weather station (b): the longest rise", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Arrays", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "longest_rise",
  "tests": [
    {"args": [[10, 11, 13, 12, 14, 15, 16, 9]], "expected": 4},
    {"args": [[5]], "expected": 1},
    {"args": [[]], "expected": 0},
    {"args": [[9, 8, 7]], "expected": 1, "hidden": true},
    {"args": [[1, 2, 2, 3, 4]], "expected": 3, "hidden": true},
    {"args": [[3, null, 4, 5, 6]], "expected": 3, "hidden": true},
    {"args": [[1, 2, 3, 4, 5, 6]], "expected": 6, "hidden": true}
  ]
}
--- description
A school weather station takes a temperature reading every hour and stores the readings in an array. If the sensor fails, the reading is stored as `None`.

Write the function `longest_rise(readings)`, which returns the length of the longest run of readings that each go up on the one before. A single reading is a run of length 1, and an empty array gives 0. A `None` reading breaks a run, and is not part of one; equal readings break a run too.

For example, `longest_rise([10, 11, 13, 12, 14, 15, 16, 9])` returns `4` (12, 14, 15, 16).

**[6 marks]**
--- hints
- Keep two counts: the length of the current run, and the longest so far.
- For each reading: if it is `None`, the current run is 0. If it is bigger than the reading before (and that one was not `None`), the run grows by 1; otherwise a new run of 1 starts. Update the longest each time.
--- starter
def longest_rise(readings):
    pass
--- solution
def longest_rise(readings):
    longest = 0
    current = 0
    previous = None
    for reading in readings:
        if reading is None:
            current = 0
        elif previous is not None and reading > previous:
            current = current + 1
        else:
            current = 1
        longest = max(longest, current)
        previous = reading
    return longest
--- explanation
One mark each, up to 6:

- Keeps a count of the current run and of the longest run.
- Compares each reading with the one before it.
- Increases the current run when the reading is higher.
- Starts a new run of 1 when it is not.
- Treats `None` as breaking the run.
- Updates the longest run and returns it (0 for an empty array).
