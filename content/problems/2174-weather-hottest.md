--- meta
{"title": "Weather station (d): the hottest day", "kind": "CODE", "difficulty": "MEDIUM", "topic": "2D arrays", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "hottest_day",
  "tests": [
    {"args": [[[10, 14, 12], [11, 13, 15], [9, 15, 8]]], "expected": 1},
    {"args": [[[5]]], "expected": 0},
    {"args": [[[null, 20], [19, null]]], "expected": 0},
    {"args": [[[1, 2], [2, 1]]], "expected": 0, "hidden": true},
    {"args": [[[null], [3], [null]]], "expected": 1, "hidden": true}
  ]
}
--- description
A school weather station takes a temperature reading every hour and stores the readings in an array. If the sensor fails, the reading is stored as `None`.

A week of readings is stored as a two-dimensional array: `days[d]` is the array of readings for day `d`. Every day has at least one reading that is not `None`.

Write the function `hottest_day(days)`, which returns the index of the day with the highest single reading. If two days share the highest reading, it returns the earlier day.

For example, `hottest_day([[10, 14, 12], [11, 13, 15], [9, 15, 8]])` returns `1`: day 1 and day 2 both reach 15, and day 1 is earlier.

**[5 marks]**
--- hints
- Keep the best reading seen so far and the day it was on.
- Loop over the days and, inside, their readings. Ignore `None`. Only replace the best when a reading is strictly higher, so an earlier day wins a tie.
--- starter
def hottest_day(days):
    pass
--- solution
def hottest_day(days):
    best = None
    best_day = 0
    for d in range(len(days)):
        for reading in days[d]:
            if reading is not None and (best is None or reading > best):
                best = reading
                best_day = d
    return best_day
--- explanation
One mark each, up to 5:

- Loops over every day, and every reading within each day.
- Ignores missing readings.
- Keeps the highest reading found so far.
- Records the day of that reading, replacing it only for a strictly higher reading.
- Returns the day's index.
