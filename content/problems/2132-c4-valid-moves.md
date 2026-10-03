--- meta
{"title": "Connect Four (b): which columns are open?", "kind": "CODE", "difficulty": "EASY", "topic": "2D arrays", "points": 15, "track": "exam", "specRef": "2.2.1", "functionName": "open_columns",
  "tests": [
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."]]], "expected": [0, 1, 2, 3, 4, 5, 6]},
    {"args": [[["R", ".", ".", ".", ".", ".", "."], ["Y", ".", ".", ".", ".", ".", "."], ["R", ".", ".", ".", ".", ".", "."], ["Y", ".", ".", ".", ".", ".", "."], ["R", ".", ".", ".", ".", ".", "."], ["Y", ".", ".", ".", ".", ".", "."]]], "expected": [1, 2, 3, 4, 5, 6]},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", "Y", ".", ".", "."], [".", ".", ".", "R", ".", ".", "."], [".", ".", "R", "Y", "R", ".", "."]]], "expected": [0, 1, 2, 3, 4, 5, 6]},
    {"args": [[["R", "R", "R", "R", "R", "R", "R"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"]]], "expected": [], "hidden": true},
    {"args": [[["R", ".", "R", ".", "R", ".", "R"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"], ["Y", "Y", "Y", "Y", "Y", "Y", "Y"]]], "expected": [1, 3, 5], "hidden": true}
  ]
}
--- description
A Connect Four game stores its board in a two-dimensional array called `board`, with 6 rows and 7 columns. `board[0]` is the top row and `board[5]` the bottom row. Each element is `"."` for an empty space, or `"R"` or `"Y"` for a red or yellow counter. Counters dropped into a column fall to the lowest empty space in it.

Write the function `open_columns(board)`, which returns a list of the column numbers that still have room for a counter, in increasing order.

**[3 marks]**
--- hints
- A column has room if its top space, `board[0][column]`, is empty.
- Loop over the columns 0 to 6 and collect those.
--- starter
def open_columns(board):
    pass
--- solution
def open_columns(board):
    columns = []
    for column in range(7):
        if board[0][column] == ".":
            columns.append(column)
    return columns
--- explanation
One mark each, up to 3:

- Loops over all 7 columns.
- Uses the top row to decide whether a column has room.
- Returns the open column numbers in increasing order.
