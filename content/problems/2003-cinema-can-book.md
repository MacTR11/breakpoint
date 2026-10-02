--- meta
{"title": "Cinema (c): can a group sit together?", "kind": "CODE", "difficulty": "MEDIUM", "topic": "2D arrays", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "can_book",
  "tests": [
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 0, 3, 3], "expected": true},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 0, 1, 3], "expected": false},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 1, 1, 2], "expected": true},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 0, 4, 3], "expected": false, "hidden": true},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 2, 0, 1], "expected": true, "hidden": true},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 1, 2, 2], "expected": false, "hidden": true},
    {"args": [[["F", "B", "F"], ["B", "B", "B"], ["F", "F", "F"]], 2, 0, 3], "expected": true, "hidden": true},
    {"args": [[["F", "B", "F"], ["B", "B", "B"], ["F", "F", "F"]], 2, 1, 3], "expected": false, "hidden": true}
  ]
}
--- description
A cinema stores one screen's seats in a two-dimensional array called `seats`. Each element is `"F"` if the seat is free or `"B"` if it is booked. `seats[0]` is the front row, and `seats[row][0]` is the seat at the left-hand end of a row. Rows may be different lengths.

A group wants `size` seats next to each other in one row, starting at seat `start`.

Write the function `can_book(seats, row, start, size)`, which returns `True` if all of those seats exist and are free, and `False` otherwise. A group cannot run off the end of the row.

For example, with a row `["F","F","B","F","F","F"]`, a group of 3 starting at seat 3 can be booked, but a group of 3 starting at seat 1 cannot (seat 2 is booked), and neither can a group of 3 starting at seat 4 (there are only two seats left in the row).

You can assume `row` is a valid row number and `start` is not negative.

**[6 marks]**
--- hints
- Deal with the group running off the end first: if `start + size` is greater than the length of the row, the answer is `False` straight away.
- Then check seats `start` to `start + size - 1`. One booked seat is enough to return `False`; return `True` only after checking them all.
--- starter
def can_book(seats, row, start, size):
    pass
--- solution
def can_book(seats, row, start, size):
    if start + size > len(seats[row]):
        return False
    for position in range(start, start + size):
        if seats[row][position] != "F":
            return False
    return True
--- explanation
One mark each, up to 6:

- Checks whether the group would go past the end of the row.
- Returns `False` in that case without reading outside the array.
- Loops from `start` for exactly `size` seats.
- Tests each of those seats in the correct row.
- Returns `False` as soon as a booked seat is found.
- Returns `True` only when every seat in the block was free.
