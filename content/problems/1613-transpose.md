--- meta
{"title": "Rows into columns", "kind": "CODE", "difficulty": "EASY", "topic": "2D lists", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "transpose",
  "tests": [
    {"args": [[[1, 2, 3], [4, 5, 6]]], "expected": [[1, 4], [2, 5], [3, 6]]},
    {"args": [[[7]]], "expected": [[7]]},
    {"args": [[[1], [2], [3]]], "expected": [[1, 2, 3]]},
    {"args": [[["a", "b"], ["c", "d"]]], "expected": [["a", "c"], ["b", "d"]], "hidden": true},
    {"args": [[[1, 2, 3]]], "expected": [[1], [2], [3]], "hidden": true}
  ]
}
--- description
Write the function `transpose(grid)`, which returns a new two-dimensional list in which the rows of `grid` have become columns. Every row of `grid` has the same length, and there is at least one row.

For example, `transpose([[1, 2, 3], [4, 5, 6]])` returns `[[1, 4], [2, 5], [3, 6]]`.
--- hints
- The answer has one row for each column of `grid`: `len(grid[0])` rows.
- Row `c` of the answer is the item at column `c` of every row of `grid`, in order.
--- starter
def transpose(grid):
    pass
--- solution
def transpose(grid):
    result = []
    for c in range(len(grid[0])):
        row = []
        for r in range(len(grid)):
            row.append(grid[r][c])
        result.append(row)
    return result
