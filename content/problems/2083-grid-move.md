--- meta
{"title": "Treasure map (c): move the player", "kind": "CODE", "difficulty": "MEDIUM", "topic": "2D arrays and selection", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "move",
  "tests": [
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 1, 1, "N"], "expected": [0, 1]},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 1, 1, "E"], "expected": [1, 2]},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 2, 1, "W"], "expected": [2, 1]},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 0, 0, "N"], "expected": [0, 0]},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 1, 1, "S"], "expected": [2, 1], "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 2, 3, "S"], "expected": [2, 3], "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 0, 3, "E"], "expected": [0, 3], "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 2, 0, "W"], "expected": [2, 0], "hidden": true},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 1, 0, "X"], "expected": [1, 0], "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 0, 1, "S"], "expected": [0, 1], "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 3, 2, "N"], "expected": [2, 2], "hidden": true}
  ]
}
--- description
A treasure-hunt game stores its map in a two-dimensional array called `grid`. Each element is one character: `"."` for open ground, `"#"` for a wall and `"T"` for treasure. `grid[0][0]` is the top-left square, and a square is addressed as `grid[row][column]`. Every row is the same length.

The player is at `grid[row][column]` and tries to move one square in a direction given by a letter: `"N"` is up the map (towards row 0), `"S"` is down, `"E"` is right and `"W"` is left.

The move only happens if the new square is on the map and is not a wall. Otherwise the player stays where they are. Any other letter also leaves the player where they are.

Write the function `move(grid, row, column, direction)`, which returns the player's position after the attempt as a list `[row, column]`.

For example, on this map a player at row 1, column 1 who moves `"N"` ends at `[0, 1]`, but one at row 2, column 1 who moves `"W"` stays at `[2, 1]` because of the wall.

```python
grid = [[".", "T", "#"],
        [".", ".", "T"],
        ["#", ".", "."]]
```

**[6 marks]**
--- hints
- Work out where the player is trying to go first: copy `row` and `column` into `new_row` and `new_column`, then change one of them depending on the direction.
- Then decide whether that square is allowed: on the map (both indexes in range) and not `"#"`. If it is allowed return the new position, otherwise return the old one.
--- starter
def move(grid, row, column, direction):
    pass
--- solution
def move(grid, row, column, direction):
    new_row = row
    new_column = column
    if direction == "N":
        new_row = row - 1
    elif direction == "S":
        new_row = row + 1
    elif direction == "E":
        new_column = column + 1
    elif direction == "W":
        new_column = column - 1
    if new_row < 0 or new_row >= len(grid) or new_column < 0 or new_column >= len(grid[0]):
        return [row, column]
    if grid[new_row][new_column] == "#":
        return [row, column]
    return [new_row, new_column]
--- explanation
One mark each, up to 6:

- Selection on the direction letter.
- North and south change the row by 1 in the correct sense.
- East and west change the column by 1 in the correct sense.
- Checks the new square is inside the map before reading it.
- Checks the new square is not a wall.
- Returns the new position when the move is allowed, and the original position otherwise (including for an unknown letter).
