--- meta
{"title": "Paths across a grid", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 25, "track": "recursion", "specRef": "2.2.1", "functionName": "paths", "banned": ["comb(", "factorial("],
  "tests": [
    {"args": [2, 2], "expected": 2},
    {"args": [1, 1], "expected": 1},
    {"args": [3, 3], "expected": 6},
    {"args": [1, 5], "expected": 1, "hidden": true},
    {"args": [3, 4], "expected": 10, "hidden": true},
    {"args": [5, 5], "expected": 70, "hidden": true}
  ]
}
--- description
A robot starts in the top-left square of a grid with `rows` rows and `columns` columns. It can only move one square right or one square down at a time.

Write a **recursive** function `paths(rows, columns)` that returns how many different routes the robot can take to reach the bottom-right square.

For example, `paths(2, 2)` returns `2` (right then down, or down then right). A grid with a single row or a single column has exactly one route.
--- hints
- If the grid is one row or one column, there is only one way: return 1.
- Otherwise the robot's first move is right or down. Each leaves a smaller grid: `paths(rows, columns - 1)` routes after moving right, and `paths(rows - 1, columns)` after moving down. Add them.
--- starter
def paths(rows, columns):
    pass
--- solution
def paths(rows, columns):
    if rows == 1 or columns == 1:
        return 1
    return paths(rows, columns - 1) + paths(rows - 1, columns)
