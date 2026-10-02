--- meta
{"title": "Treasure map (b): can the player stand here?", "kind": "CODE", "difficulty": "EASY", "topic": "2D arrays", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "can_stand",
  "tests": [
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 1, 1], "expected": true},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 0, 2], "expected": false},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 3, 0], "expected": false},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 0, -1], "expected": false},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 0, 1], "expected": true, "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 3, 3], "expected": false, "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 2, 4], "expected": false, "hidden": true},
    {"args": [[["T"]], 0, 0], "expected": true, "hidden": true},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], -1, 1], "expected": false, "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 3, 2], "expected": true, "hidden": true}
  ]
}
--- description
A treasure-hunt game stores its map in a two-dimensional array called `grid`. Each element is one character: `"."` for open ground, `"#"` for a wall and `"T"` for treasure. `grid[0][0]` is the top-left square, and a square is addressed as `grid[row][column]`. Every row is the same length.

The player can stand on open ground or on treasure, but not on a wall, and not outside the map.

Write the function `can_stand(grid, row, column)`, which returns `True` if the player can stand on that square and `False` otherwise. `row` and `column` can be any integers, including negative ones.

**[4 marks]**
--- hints
- Check the square is on the map **before** reading it: `row` must be at least 0 and less than `len(grid)`, and `column` must be at least 0 and less than `len(grid[0])`.
- Careful: in Python a negative index does not crash, it counts from the end. So `grid[-1][0]` would quietly read the wrong square. That is why the bounds check has to come first.
--- starter
def can_stand(grid, row, column):
    pass
--- solution
def can_stand(grid, row, column):
    if row < 0 or row >= len(grid):
        return False
    if column < 0 or column >= len(grid[0]):
        return False
    return grid[row][column] != "#"
--- explanation
One mark each, up to 4:

- Rejects a row that is negative or too large.
- Rejects a column that is negative or too large.
- Makes both checks before reading the array.
- Returns `False` for a wall and `True` for any other square on the map.
