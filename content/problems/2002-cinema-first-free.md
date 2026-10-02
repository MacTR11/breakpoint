--- meta
{"title": "Cinema (b): first free seat in a row", "kind": "CODE", "difficulty": "EASY", "topic": "2D arrays", "points": 10, "track": "exam", "specRef": "2.2.1", "functionName": "first_free",
  "tests": [
    {"args": [[["F", "B", "F"], ["B", "B", "B"], ["F", "F", "F"]], 0], "expected": 0},
    {"args": [[["F", "B", "F"], ["B", "B", "B"], ["F", "F", "F"]], 1], "expected": -1},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 0], "expected": 0},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]], 1], "expected": 1, "hidden": true},
    {"args": [[["B", "B"], ["B", "F"]], 1], "expected": 1, "hidden": true},
    {"args": [[["F", "B", "F"], ["B", "B", "B"], ["F", "F", "F"]], 2], "expected": 0, "hidden": true}
  ]
}
--- description
A cinema stores one screen's seats in a two-dimensional array called `seats`. Each element is `"F"` if the seat is free or `"B"` if it is booked. `seats[0]` is the front row, and `seats[row][0]` is the seat at the left-hand end of a row. Rows may be different lengths.

Write the function `first_free(seats, row)`, which returns the index of the first free seat in the given row, counting from the left. If the row has no free seats it returns `-1`.

You can assume `row` is a valid row number.

**[4 marks]**
--- hints
- Loop over the positions in `seats[row]` with `range(len(seats[row]))`, so that you have the index to return.
- Return as soon as you find a free seat. If the loop finishes without returning, there was none, so return -1 after it.
--- starter
def first_free(seats, row):
    pass
--- solution
def first_free(seats, row):
    for position in range(len(seats[row])):
        if seats[row][position] == "F":
            return position
    return -1
--- explanation
One mark each, up to 4:

- Loops through the seats of the correct row only.
- Compares each seat with `"F"`.
- Returns the index (not the seat) of the first match, and stops looking.
- Returns `-1` only after every seat in the row has been checked.
