--- meta
{"title": "Pascal's triangle", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Lists", "points": 25, "track": "lists", "specRef": "2.2.1", "functionName": "pascal_row", "banned": ["comb(", "factorial("],
  "tests": [
    {"args": [0], "expected": [1]},
    {"args": [1], "expected": [1, 1]},
    {"args": [4], "expected": [1, 4, 6, 4, 1]},
    {"args": [6], "expected": [1, 6, 15, 20, 15, 6, 1], "hidden": true},
    {"args": [10], "expected": [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1], "hidden": true}
  ]
}
--- description
Each row of Pascal's triangle starts and ends with 1, and every other number is the sum of the two numbers above it:

```
row 0:        1
row 1:       1 1
row 2:      1 2 1
row 3:     1 3 3 1
row 4:    1 4 6 4 1
```

Write the function `pascal_row(n)`, which returns row `n` as a list. For example, `pascal_row(4)` returns `[1, 4, 6, 4, 1]`.
--- hints
- Start with row 0, `[1]`, and build each row from the one before, `n` times.
- The next row is 1, then the sums of each neighbouring pair in the current row, then 1.
--- starter
def pascal_row(n):
    pass
--- solution
def pascal_row(n):
    row = [1]
    for i in range(n):
        next_row = [1]
        for j in range(len(row) - 1):
            next_row.append(row[j] + row[j + 1])
        next_row.append(1)
        row = next_row
    return row
