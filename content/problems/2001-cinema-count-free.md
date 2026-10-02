--- meta
{"title": "Cinema (a): count the free seats", "kind": "CODE", "difficulty": "EASY", "topic": "2D arrays", "points": 10, "track": "exam", "specRef": "2.2.1", "functionName": "count_free",
  "tests": [
    {"args": [[["F", "B", "F"], ["B", "B", "B"], ["F", "F", "F"]]], "expected": 5},
    {"args": [[["B", "B"], ["B", "F"]]], "expected": 1},
    {"args": [[["B"]]], "expected": 0},
    {"args": [[["F", "F", "B", "F", "F", "F"], ["B", "F", "F", "B"], ["F"]]], "expected": 8, "hidden": true},
    {"args": [[[]]], "expected": 0, "hidden": true},
    {"args": [[["F", "F"], ["F", "F"], ["F", "F"]]], "expected": 6, "hidden": true}
  ]
}
--- description
A cinema stores one screen's seats in a two-dimensional array called `seats`. Each element is `"F"` if the seat is free or `"B"` if it is booked. `seats[0]` is the front row, and `seats[row][0]` is the seat at the left-hand end of a row. Rows may be different lengths.

Write the function `count_free(seats)`, which returns the total number of free seats on the screen.

**[4 marks]**
--- hints
- You need to look at every seat, so use one loop for the rows and another inside it for the seats in that row.
- Start a counter at 0 before the loops and add 1 each time a seat is equal to `"F"`.
--- starter
def count_free(seats):
    pass
--- solution
def count_free(seats):
    free = 0
    for row in seats:
        for seat in row:
            if seat == "F":
                free = free + 1
    return free
--- explanation
One mark each, up to 4:

- A counter is set to 0 before any looping.
- Every row is visited, and every seat within each row (a nested loop).
- The counter goes up by 1 only when a seat is `"F"`.
- The counter is returned after both loops have finished.
