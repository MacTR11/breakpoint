--- meta
{
  "title": "N Queens", "kind": "CODE", "difficulty": "HARD", "topic": "Backtracking", "points": 40, "track": "algorithms", "specRef": "2.2.2",
  "functionName": "count_queens",
  "tests": [
    { "args": [1], "expected": 1 },
    { "args": [4], "expected": 2 },
    { "args": [2], "expected": 0 },
    { "args": [3], "expected": 0, "hidden": true },
    { "args": [5], "expected": 10, "hidden": true },
    { "args": [6], "expected": 4, "hidden": true },
    { "args": [7], "expected": 40, "hidden": true },
    { "args": [8], "expected": 92, "hidden": true }
  ]
}
--- description
A chess queen attacks any piece in the same row, the same column or on the same diagonal.

Write a function `count_queens(n)` that returns the number of different ways to place `n` queens on an `n × n` board so that **no two queens attack each other**.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `count_queens(1)` | `1` | one queen, one square |
| `count_queens(2)` | `0` | impossible |
| `count_queens(4)` | `2` | |

The two solutions for a 4 × 4 board:

```
. Q . .      . . Q .
. . . Q      Q . . .
Q . . .      . . . Q
. . Q .      . Q . .
```

### Backtracking

Each row must hold exactly one queen. Place a queen in row 0, then try each column of row 1 that is not attacked, and so on. When a row has no safe column, **go back** to the previous row and try its next column. Count each time you fill the last row.

The largest board tested is 8 × 8.
--- hints
- Place one queen per row. Keep a list where `columns[r]` is the column of the queen in row `r`.
- A new queen at (`row`, `column`) clashes with an earlier one if the columns match, or if the difference in columns equals the difference in rows (a diagonal).
--- starter
def count_queens(n):
    # Write your code here
    pass
--- solution
def count_queens(n):
    columns = []

    def safe(row, column):
        for other_row, other_column in enumerate(columns):
            if other_column == column or abs(other_column - column) == row - other_row:
                return False
        return True

    def place(row):
        if row == n:
            return 1
        total = 0
        for column in range(n):
            if safe(row, column):
                columns.append(column)
                total += place(row + 1)
                columns.pop()
        return total

    return place(0)
