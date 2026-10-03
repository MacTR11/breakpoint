--- meta
{"title": "Search a grid", "kind": "CODE", "difficulty": "EASY", "topic": "Linear search in 2D", "points": 10, "track": "searching", "specRef": "2.3.1", "functionName": "find_in_grid",
  "tests": [
    {"args": [[[3, 8], [5, 1]], 5], "expected": [1, 0]},
    {"args": [[[3, 8], [5, 1]], 9], "expected": [-1, -1]},
    {"args": [[[7]], 7], "expected": [0, 0]},
    {"args": [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], 9], "expected": [2, 2], "hidden": true},
    {"args": [[[2, 2], [2, 2]], 2], "expected": [0, 0], "hidden": true},
    {"args": [[[]], 1], "expected": [-1, -1], "hidden": true}
  ]
}
--- description
Write the function `find_in_grid(grid, target)`, which searches a two-dimensional list row by row, from the top, and left to right along each row. It returns the position of the first match as `[row, column]`, or `[-1, -1]` if the target is not there.

For example, `find_in_grid([[3, 8], [5, 1]], 5)` returns `[1, 0]`.
--- hints
- Use two loops over the indexes: `for row in range(len(grid))` and, inside it, `for column in range(len(grid[row]))`.
- Return `[row, column]` straight away when you find the target. After both loops, return `[-1, -1]`.
--- starter
def find_in_grid(grid, target):
    pass
--- solution
def find_in_grid(grid, target):
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            if grid[row][column] == target:
                return [row, column]
    return [-1, -1]
