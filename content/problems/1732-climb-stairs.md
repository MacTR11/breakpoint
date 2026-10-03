--- meta
{"title": "Up the stairs", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Dynamic programming", "points": 25, "track": "algorithms", "specRef": "2.3.1", "functionName": "ways",
  "tests": [
    {"args": [1], "expected": 1},
    {"args": [2], "expected": 2},
    {"args": [3], "expected": 3},
    {"args": [5], "expected": 8, "hidden": true},
    {"args": [10], "expected": 89, "hidden": true},
    {"args": [40], "expected": 165580141, "hidden": true}
  ]
}
--- description
You climb a staircase one or two steps at a time. Write the function `ways(n)`, which returns how many different ways there are to climb `n` steps (n is 1 or more).

For example, `ways(3)` returns `3`: 1+1+1, 1+2 and 2+1.

`ways(40)` must come back quickly, so do not work the same thing out over and over again.
--- hints
- To reach step n your last move came from step n − 1 or step n − 2, so `ways(n) = ways(n - 1) + ways(n - 2)`.
- Plain recursion repeats work. Build the answers upwards in a loop from the bottom step instead, keeping the last two.
--- starter
def ways(n):
    pass
--- solution
def ways(n):
    previous, current = 1, 1
    for step in range(n - 1):
        previous, current = current, previous + current
    return current
