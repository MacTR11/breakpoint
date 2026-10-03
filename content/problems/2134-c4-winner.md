--- meta
{"title": "Connect Four (d): is there a winner?", "kind": "CODE", "difficulty": "HARD", "topic": "2D arrays", "points": 40, "track": "exam", "specRef": "2.2.1", "functionName": "winner",
  "tests": [
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", "R", "R", "R", "R", "Y", "."]]], "expected": "R"},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", "Y", ".", "."], [".", ".", ".", ".", "Y", ".", "."], [".", ".", ".", ".", "Y", ".", "."], ["R", ".", ".", "R", "Y", ".", "R"]]], "expected": "Y"},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "R"], [".", ".", ".", ".", ".", "R", "Y"], [".", ".", ".", ".", "R", "Y", "Y"], [".", ".", ".", "R", "Y", "Y", "Y"]]], "expected": "R"},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], ["Y", ".", ".", ".", ".", ".", "."], ["R", "Y", ".", ".", ".", ".", "."], ["R", "R", "Y", ".", ".", ".", "."], ["R", "R", "Y", "Y", ".", ".", "."]]], "expected": "Y", "hidden": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], ["R", "R", "R", ".", "Y", "Y", "Y"], ["Y", "Y", "Y", "R", "R", "R", "Y"]]], "expected": "", "hidden": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."]]], "expected": "", "hidden": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", "Y", ".", ".", "."], [".", ".", ".", "R", ".", ".", "."], [".", ".", "R", "Y", "R", ".", "."]]], "expected": "", "hidden": true},
    {"args": [[[".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", "."], [".", ".", ".", "R", ".", ".", "."], [".", ".", ".", ".", "R", ".", "."], [".", ".", ".", ".", ".", "R", "."], [".", ".", ".", ".", ".", ".", "R"]]], "expected": "R", "hidden": true}
  ]
}
--- description
A Connect Four game stores its board in a two-dimensional array called `board`, with 6 rows and 7 columns. `board[0]` is the top row and `board[5]` the bottom row. Each element is `"."` for an empty space, or `"R"` or `"Y"` for a red or yellow counter. Counters dropped into a column fall to the lowest empty space in it.

Write the function `winner(board)`, which returns `"R"` or `"Y"` if that colour has four counters in a line: across a row, down a column, or along either diagonal. If nobody has four in a line it returns `""`. You can assume at most one colour has won.

**[8 marks]**
--- hints
- Try every space as the start of a line, and four directions from it: right (0, 1), down (1, 0), down-right (1, 1) and down-left (1, -1).
- For each start and direction, work out the four positions. Skip them if any is off the board; otherwise, if all four hold the same counter and it is not `"."`, that counter has won.
--- starter
def winner(board):
    pass
--- solution
def winner(board):
    directions = [[0, 1], [1, 0], [1, 1], [1, -1]]
    for row in range(6):
        for column in range(7):
            counter = board[row][column]
            if counter == ".":
                continue
            for down, across in directions:
                end_row = row + 3 * down
                end_column = column + 3 * across
                if end_row < 0 or end_row > 5 or end_column < 0 or end_column > 6:
                    continue
                if all(board[row + k * down][column + k * across] == counter for k in range(4)):
                    return counter
    return ""
--- explanation
One mark each, up to 8:

- Considers every space as a possible start of a line.
- Ignores empty spaces.
- Checks lines across rows.
- Checks lines down columns.
- Checks lines along the down-right diagonal.
- Checks lines along the down-left diagonal.
- Never reads outside the board.
- Returns the winning colour, or `""` when there is none.
