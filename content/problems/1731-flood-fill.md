--- meta
{"title": "Flood fill", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion and grids", "points": 25, "track": "algorithms", "specRef": "2.3.1", "functionName": "flood_fill",
  "tests": [
    {"args": [[[".", ".", "#"], [".", "#", "."], ["#", ".", "."]], 0, 0, "*"], "expected": [["*", "*", "#"], ["*", "#", "."], ["#", ".", "."]]},
    {"args": [[["#"]], 0, 0, "*"], "expected": [["*"]]},
    {"args": [[[".", ".", "."], [".", ".", "."]], 1, 2, "o"], "expected": [["o", "o", "o"], ["o", "o", "o"]]},
    {"args": [[[".", "#", "."], ["#", "#", "#"], [".", "#", "."]], 0, 2, "x"], "expected": [[".", "#", "x"], ["#", "#", "#"], [".", "#", "."]], "hidden": true},
    {"args": [[["a", "a"], ["a", "b"]], 1, 1, "a"], "expected": [["a", "a"], ["a", "a"]], "hidden": true}
  ]
}
--- description
A paint program's "fill" tool changes the colour of one square and every square of the same colour joined to it, up, down, left and right (not diagonally).

Write the function `flood_fill(grid, row, column, colour)`, where `grid` is a two-dimensional list of one-character strings. It fills from `grid[row][column]` with `colour` and returns the grid. If the square is already `colour`, nothing changes.

For example, filling `[[".", ".", "#"], [".", "#", "."], ["#", ".", "."]]` from `(0, 0)` with `"*"` gives `[["*", "*", "#"], ["*", "#", "."], ["#", ".", "."]]`.
--- hints
- Remember the colour being replaced, from the starting square. If it is already the new colour, return straight away.
- A recursive helper can colour one square, then call itself on the four neighbours: only those on the grid and still the old colour.
--- starter
def flood_fill(grid, row, column, colour):
    pass
--- solution
def flood_fill(grid, row, column, colour):
    old = grid[row][column]
    if old == colour:
        return grid

    def fill(r, c):
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[r]) or grid[r][c] != old:
            return
        grid[r][c] = colour
        fill(r + 1, c)
        fill(r - 1, c)
        fill(r, c + 1)
        fill(r, c - 1)

    fill(row, column)
    return grid
