--- meta
{"title": "Two-dimensional lists", "kind": "PUZZLE", "difficulty": "EASY", "topic": "2D arrays", "points": 5, "track": "lists", "specRef": "2.2.1", "check": "run", "options": ["6", "8", "10", "12"], "answer": 2}
--- description
```python
grid = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
print(grid[2][0] + grid[0][2])
```

What does this program print?
--- hints
- The first index chooses the row, the second chooses the column, and both start at 0.
--- explanation
`grid[2]` is the third row, `[7, 8, 9]`, and its item at index 0 is **7**.

`grid[0]` is the first row, `[1, 2, 3]`, and its item at index 2 is **3**.

7 + 3 = **10**.
