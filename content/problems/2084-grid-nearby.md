--- meta
{"title": "Treasure map (d): treasure nearby", "kind": "CODE", "difficulty": "HARD", "topic": "2D arrays", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "treasure_nearby",
  "tests": [
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 1, 1], "expected": 2},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 0, 0], "expected": 1},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 3, 0], "expected": 2},
    {"args": [[["T"]], 0, 0], "expected": 0, "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 2, 1], "expected": 3, "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 0, 3], "expected": 0, "hidden": true},
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]], 2, 2], "expected": 1, "hidden": true},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]], 3, 3], "expected": 1, "hidden": true},
    {"args": [[["T", "T", "T"], ["T", "T", "T"], ["T", "T", "T"]], 1, 1], "expected": 8, "hidden": true}
  ]
}
--- description
A treasure-hunt game stores its map in a two-dimensional array called `grid`. Each element is one character: `"."` for open ground, `"#"` for a wall and `"T"` for treasure. `grid[0][0]` is the top-left square, and a square is addressed as `grid[row][column]`. Every row is the same length.

The game shows the player how much treasure is close by.

Write the function `treasure_nearby(grid, row, column)`, which returns the number of squares containing treasure among the squares that touch `grid[row][column]`, including diagonally. That is up to 8 squares. The square itself is not counted, and squares off the edge of the map do not exist.

For example, on this map `treasure_nearby(grid, 1, 1)` returns `2`.

```python
grid = [[".", "T", "#"],
        [".", ".", "T"],
        ["#", ".", "."]]
```

You can assume `row` and `column` are on the map.

**[6 marks]**
--- hints
- The neighbours are every combination of `row - 1`, `row`, `row + 1` with `column - 1`, `column`, `column + 1`, apart from the square itself. Two nested loops over `range(-1, 2)` produce the nine offsets.
- For each neighbour, skip it if both offsets are 0, and skip it if it is off the map. Only then look in the array.
--- starter
def treasure_nearby(grid, row, column):
    pass
--- solution
def treasure_nearby(grid, row, column):
    count = 0
    for row_change in range(-1, 2):
        for column_change in range(-1, 2):
            r = row + row_change
            c = column + column_change
            if row_change == 0 and column_change == 0:
                continue
            if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]):
                continue
            if grid[r][c] == "T":
                count = count + 1
    return count
--- explanation
One mark each, up to 6:

- Visits the rows above, level with and below the square.
- Visits the columns to the left, level with and to the right.
- Does not count the square itself.
- Skips neighbours that are off the map, before reading the array.
- Counts the neighbours that hold `"T"`.
- Returns the count.
