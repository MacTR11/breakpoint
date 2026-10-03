--- meta
{"title": "Merging bookings", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Algorithms", "points": 25, "track": "algorithms", "specRef": "2.2.1", "functionName": "merge_bookings",
  "tests": [
    {"args": [[[9, 11], [10, 12], [14, 15]]], "expected": [[9, 12], [14, 15]]},
    {"args": [[]], "expected": []},
    {"args": [[[1, 2]]], "expected": [[1, 2]]},
    {"args": [[[5, 6], [1, 3], [2, 4]]], "expected": [[1, 4], [5, 6]], "hidden": true},
    {"args": [[[1, 10], [2, 3], [4, 5]]], "expected": [[1, 10]], "hidden": true},
    {"args": [[[1, 2], [2, 3]]], "expected": [[1, 3]], "hidden": true},
    {"args": [[[8, 9], [6, 7], [4, 5]]], "expected": [[4, 5], [6, 7], [8, 9]], "hidden": true}
  ]
}
--- description
A meeting room's bookings are a list of `[start, end]` pairs, in hours. Write the function `merge_bookings(bookings)`, which returns the times the room is in use: a list of pairs, sorted by start time, with any bookings that overlap or touch merged into one.

For example, `merge_bookings([[9, 11], [10, 12], [14, 15]])` returns `[[9, 12], [14, 15]]`, and `[[1, 2], [2, 3]]` becomes `[[1, 3]]`.
--- hints
- Sort the bookings by start time first: `sorted(bookings)` does this for pairs.
- Go through them in order. If a booking starts at or before the end of the last merged one, stretch that one's end to whichever end is later. Otherwise start a new merged booking.
--- starter
def merge_bookings(bookings):
    pass
--- solution
def merge_bookings(bookings):
    merged = []
    for start, end in sorted(bookings):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
