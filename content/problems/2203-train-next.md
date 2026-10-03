--- meta
{"title": "Timetable (c): the next train", "kind": "CODE", "difficulty": "HARD", "topic": "Binary search", "points": 35, "track": "exam", "specRef": "2.3.1", "functionName": "next_train",
  "tests": [
    {"args": [["06:10", "07:45", "09:00", "12:30", "17:15", "22:40"], "08:00"], "expected": "09:00"},
    {"args": [["06:10", "07:45", "09:00", "12:30", "17:15", "22:40"], "07:45"], "expected": "07:45"},
    {"args": [["06:10", "07:45", "09:00", "12:30", "17:15", "22:40"], "23:00"], "expected": "06:10"},
    {"args": [["06:10", "07:45", "09:00", "12:30", "17:15", "22:40"], "00:00"], "expected": "06:10", "hidden": true},
    {"args": [["10:00"], "09:59"], "expected": "10:00", "hidden": true},
    {"args": [["10:00"], "10:01"], "expected": "10:00", "hidden": true},
    {"args": [["06:10", "07:45", "09:00", "12:30", "17:15", "22:40"], "17:16"], "expected": "22:40", "hidden": true}
  ]
}
--- description
A station shows train times as strings in the 24-hour form `"HH:MM"`, such as `"07:45"` or `"23:10"`.

`times` is a list of the day's departures, in order from earliest to latest. Write the function `next_train(times, now)`, which uses a **binary search** to return the first departure at or after the time `now`. If there are no more trains today, it returns the first train of the day (tomorrow's).

For example, with `["06:10", "07:45", "09:00", "12:30", "17:15", "22:40"]`, `next_train(times, "08:00")` returns `"09:00"`, and `next_train(times, "23:00")` returns `"06:10"`.

**[7 marks]**
--- hints
- Compare times as minutes since midnight (part (a)), or compare the strings directly: two-digit `"HH:MM"` strings sort in time order.
- Search for the first position whose time is at or after `now`: keep `low` and `high`, and while `low < high` look at the middle. If the middle time is before `now`, the answer is to its right.
- If the search ends past the last position, wrap round to `times[0]`.
--- starter
def next_train(times, now):
    pass
--- solution
def next_train(times, now):
    low = 0
    high = len(times)
    while low < high:
        mid = (low + high) // 2
        if times[mid] < now:
            low = mid + 1
        else:
            high = mid
    if low == len(times):
        return times[0]
    return times[low]
--- explanation
One mark each, up to 7:

- Compares times correctly (as minutes, or as two-digit strings).
- Sets up the low and high ends of the search.
- Repeats while the search area is not empty.
- Works out the middle position.
- Moves the correct end of the search depending on the comparison.
- Finds the first departure at or after `now`.
- Returns the first train of the day when there is none left today.
