--- meta
{"title": "Times Table", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "times_table",
  "tests": [
    {"args": [3], "expected": [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]},
    {"args": [1], "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]},
    {"args": [0], "expected": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    {"args": [12], "expected": [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144], "hidden": true},
    {"args": [-2], "expected": [-2, -4, -6, -8, -10, -12, -14, -16, -18, -20, -22, -24], "hidden": true},
    {"args": [7], "expected": [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84], "hidden": true}
  ]
}
--- description
Write a function `times_table(n)` that returns a list of the first **twelve** multiples of `n`: `n × 1` up to `n × 12`.

### Example

`times_table(3)` returns `[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]`
--- hints
- `range(1, 13)` produces the numbers 1 to 12.
- Start with an empty list and `append(n * i)` each time round the loop.
--- starter
def times_table(n):
    # Write your code here
    pass
--- solution
def times_table(n):
    result = []
    for i in range(1, 13):
        result.append(n * i)
    return result
