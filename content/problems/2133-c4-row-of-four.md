--- meta
{"title": "Connect Four (c): four in a row", "kind": "CODE", "difficulty": "MEDIUM", "topic": "2D arrays", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "four_across",
  "tests": [
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", "R", "R", "R", "R", "Y", "."]], "R"], "expected": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", "R", "R", "R", "R", "Y", "."]], "Y"], "expected": false},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."]], "R"], "expected": false},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", "Y", ".", "."], [".", ".", ".", ".", "Y", ".", "."], [".", ".", ".", ".", "Y", ".", "."], ["R", ".", ".", "R", "Y", ".", "R"]], "Y"], "expected": false, "hidden": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], ["R", "R", "R", ".", "Y", "Y", "Y"], ["Y", "Y", "Y", "R", "R", "R", "Y"]], "R"], "expected": false, "hidden": true},
    {"args": [[["Y", "Y", "Y", "Y", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."]], "Y"], "expected": true, "hidden": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], ["R", "R", "R", ".", "R", "R", "R"]], "R"], "expected": false, "hidden": true}
  ]
}
--- description
A Connect Four game stores its board in a two-dimensional array called `board`, with 6 rows and 7 columns. `board[0]` is the top row and `board[5]` the bottom row. Each element is `"."` for an empty space, or `"R"` or `"Y"` for a red or yellow counter. Counters dropped into a column fall to the lowest empty space in it.

Write the function `four_across(board, counter)`, which returns `True` if `counter` has four counters next to each other in any **row** of the board, and `False` otherwise. (Columns and diagonals are part (d).)

**[6 marks]**
--- hints
- In a row of 7, a line of four can start at column 0, 1, 2 or 3.
- For every row and every starting column from 0 to 3, check the four spaces from there are all `counter`.
--- starter
def four_across(board, counter):
    pass
--- solution
def four_across(board, counter):
    for row in range(6):
        for start in range(4):
            if all(board[row][start + k] == counter for k in range(4)):
                return True
    return False
--- explanation
One mark each, up to 6:

- Loops over every row.
- Loops over every possible starting column (0 to 3), without going off the board.
- Checks four neighbouring spaces in the row.
- All four must hold the counter.
- Returns `True` as soon as a line is found.
- Returns `False` after checking every possibility.
