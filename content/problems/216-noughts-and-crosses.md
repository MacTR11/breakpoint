--- meta
{
  "title": "Noughts and crosses", "kind": "CODE", "difficulty": "MEDIUM", "topic": "2D arrays", "points": 25, "track": "lists", "specRef": "1.4.2",
  "functionName": "winner",
  "tests": [
    { "args": [["XXX", "O.O", "..."]], "expected": "X" },
    { "args": [["OX.", "XO.", "..O"]], "expected": "O" },
    { "args": [["XOX", "OXO", "OXO"]], "expected": "" },
    { "args": [["XO.", "XO.", "X.."]], "expected": "X", "hidden": true },
    { "args": [["...", "...", "..."]], "expected": "", "hidden": true },
    { "args": [["..O", ".O.", "O.X"]], "expected": "O", "hidden": true },
    { "args": [["XOO", "XXO", "OXX"]], "expected": "X", "hidden": true },
    { "args": [["XX.", "OOO", "X.."]], "expected": "O", "hidden": true }
  ]
}
--- description
A noughts and crosses board is stored as a two-dimensional array: a list of three strings, one per row. Each character is `"X"`, `"O"` or `"."` for an empty square, so `board[row][column]` gives one square.

Write a function `winner(board)` that returns `"X"` or `"O"` if that player has three in a line (a row, a column or a diagonal), or an empty string `""` if nobody has won.

No board has more than one winner.

### Examples

```
XXX      OX.      XOX
O.O      XO.      OXO
...      ..O      OXO
```

return `"X"`, `"O"` and `""`.
--- hints
- There are 8 lines to check: 3 rows, 3 columns and 2 diagonals.
- A line is won when its first square is not `"."` and all three squares are equal. `board[row][column]` reads one square.
--- starter
def winner(board):
    # Write your code here
    pass
--- solution
def winner(board):
    lines = []
    for i in range(3):
        lines.append([board[i][0], board[i][1], board[i][2]])
        lines.append([board[0][i], board[1][i], board[2][i]])
    lines.append([board[0][0], board[1][1], board[2][2]])
    lines.append([board[0][2], board[1][1], board[2][0]])
    for line in lines:
        if line[0] != "." and line[0] == line[1] == line[2]:
            return line[0]
    return ""
