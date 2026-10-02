--- meta
{"title": "Arrays (a): the range of the readings", "kind": "CODE", "difficulty": "EASY", "topic": "Arrays", "points": 10, "track": "exam", "specRef": "2.2.1", "functionName": "reading_range", "banned": ["max(", "min(", "sorted(", ".sort("],
  "tests": [
    {"args": [[12, 19, 7, 15]], "expected": 12},
    {"args": [[5]], "expected": 0},
    {"args": [[-3, -9, -1]], "expected": 8},
    {"args": [[4, 4, 4]], "expected": 0, "hidden": true},
    {"args": [[0, 100]], "expected": 100, "hidden": true},
    {"args": [[21.5, 19.0, 23.5, 20.0]], "expected": 4.5, "hidden": true},
    {"args": [[7, -7]], "expected": 14, "hidden": true}
  ]
}
--- description
A weather station stores a day's temperature readings in an array called `readings`. There is always at least one reading.

Write the function `reading_range(readings)`, which returns the difference between the highest and the lowest reading.

Find the highest and lowest yourself: do not use `max`, `min` or a sort.

For example, `reading_range([12, 19, 7, 15])` returns `12`.

**[4 marks]**
--- hints
- Start both `highest` and `lowest` at the first reading, `readings[0]`. Starting them at 0 would give the wrong answer when every reading is negative.
- Loop through the readings. Replace `highest` when you see something larger, and `lowest` when you see something smaller.
--- starter
def reading_range(readings):
    pass
--- solution
def reading_range(readings):
    highest = readings[0]
    lowest = readings[0]
    for reading in readings:
        if reading > highest:
            highest = reading
        if reading < lowest:
            lowest = reading
    return highest - lowest
--- explanation
One mark each, up to 4:

- The highest and lowest are initialised to a value from the array (not to 0).
- Loops through every reading.
- Updates the highest and the lowest with correct comparisons.
- Returns highest minus lowest.
