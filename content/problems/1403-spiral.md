--- meta
{"title": "Spiral order", "kind": "CODE", "difficulty": "HARD", "topic": "2D arrays", "points": 50, "track": "lists", "specRef": "1.4.2", "contest": "grand-final", "functionName": "spiral",
  "tests": [
    {"args": [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], "expected": [1, 2, 3, 6, 9, 8, 7, 4, 5]},
    {"args": [[[1, 2], [3, 4]]], "expected": [1, 2, 4, 3]},
    {"args": [[[7]]], "expected": [7]},
    {"args": [[[1, 2, 3, 4]]], "expected": [1, 2, 3, 4], "hidden": true},
    {"args": [[[1], [2], [3]]], "expected": [1, 2, 3], "hidden": true},
    {"args": [[[1, 2, 3], [4, 5, 6]]], "expected": [1, 2, 3, 6, 5, 4], "hidden": true},
    {"args": [[[1, 2], [3, 4], [5, 6]]], "expected": [1, 2, 4, 6, 5, 3], "hidden": true},
    {"args": [[]], "expected": [], "hidden": true}
  ]
}
--- description
Write a function `spiral(grid)` that returns the values of a two-dimensional list in **spiral order**: start at the top-left, go right along the top row, down the right-hand column, left along the bottom row, up the left-hand column, and keep spiralling inwards.

Every row of the grid is the same length. An empty grid returns an empty list.

### Example

```
1 2 3
4 5 6
7 8 9
```

`spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]])` returns `[1, 2, 3, 6, 9, 8, 7, 4, 5]`.
--- hints
- Keep four boundaries: `top`, `bottom`, `left` and `right`. After walking along an edge, move that boundary inwards by one.
- Loop while `top <= bottom and left <= right`. Before walking the bottom row and the left column, check the boundaries again, or a single row or column gets visited twice.
--- starter
def spiral(grid):
    # Write your code here
    pass
--- solution
def spiral(grid):
    result = []
    if len(grid) == 0:
        return result
    top = 0
    bottom = len(grid) - 1
    left = 0
    right = len(grid[0]) - 1
    while top <= bottom and left <= right:
        for column in range(left, right + 1):
            result.append(grid[top][column])
        top += 1
        for row in range(top, bottom + 1):
            result.append(grid[row][right])
        right -= 1
        if top <= bottom:
            for column in range(right, left - 1, -1):
                result.append(grid[bottom][column])
            bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(grid[row][left])
            left += 1
    return result
