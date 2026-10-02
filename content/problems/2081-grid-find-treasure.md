--- meta
{"title": "Treasure map (a): list the treasure", "kind": "CODE", "difficulty": "EASY", "topic": "2D arrays", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "find_treasure",
  "tests": [
    {"args": [[[".", "T", "#"], [".", ".", "T"], ["#", ".", "."]]], "expected": [[0, 1], [1, 2]]},
    {"args": [[["T"]]], "expected": [[0, 0]]},
    {"args": [[["#", "#"], ["#", "#"]]], "expected": []},
    {"args": [[[".", ".", ".", "."], [".", "#", "#", "."], ["T", ".", ".", "T"], ["T", "T", ".", "#"]]], "expected": [[2, 0], [2, 3], [3, 0], [3, 1]], "hidden": true},
    {"args": [[[".", "."]]], "expected": [], "hidden": true},
    {"args": [[["T", "T"], ["T", "T"]]], "expected": [[0, 0], [0, 1], [1, 0], [1, 1]], "hidden": true}
  ]
}
--- description
A treasure-hunt game stores its map in a two-dimensional array called `grid`. Each element is one character: `"."` for open ground, `"#"` for a wall and `"T"` for treasure. `grid[0][0]` is the top-left square, and a square is addressed as `grid[row][column]`. Every row is the same length.

Write the function `find_treasure(grid)`, which returns a list of the positions of every treasure. Each position is a list `[row, column]`. The positions must be in the order they are met when the grid is read row by row from the top, and left to right within a row.

For example, for

```python
grid = [[".", "T", "#"],
        [".", ".", "T"],
        ["#", ".", "."]]
```

it returns `[[0, 1], [1, 2]]`. If there is no treasure it returns `[]`.

**[5 marks]**
--- hints
- You need the indexes, not just the characters, so loop with `for row in range(len(grid)):` and `for column in range(len(grid[row])):`.
- When `grid[row][column] == "T"`, append the list `[row, column]` to your result.
--- starter
def find_treasure(grid):
    pass
--- solution
def find_treasure(grid):
    positions = []
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            if grid[row][column] == "T":
                positions.append([row, column])
    return positions
--- explanation
One mark each, up to 5:

- An empty list is created before the loops.
- An outer loop over the row indexes.
- An inner loop over the column indexes of that row.
- Tests whether the square holds `"T"`.
- Adds `[row, column]` for each treasure and returns the list, in row-by-row order.
