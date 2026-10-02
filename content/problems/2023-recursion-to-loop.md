--- meta
{"title": "Recursion (c): rewrite it with a loop", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion and iteration", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "step_total_loop", "banned": ["step_total("],
  "tests": [
    {"args": [7], "expected": 16},
    {"args": [4], "expected": 6},
    {"args": [0], "expected": 0},
    {"args": [1], "expected": 1, "hidden": true},
    {"args": [10], "expected": 30, "hidden": true},
    {"args": [-3], "expected": 0, "hidden": true},
    {"args": [25], "expected": 169, "hidden": true}
  ]
}
--- description
A programmer has written this recursive function:

```python
def step_total(n):
    if n <= 0:
        return 0
    return n + step_total(n - 2)
```

`step_total(7)` returns `16`, because 7 + 5 + 3 + 1 = 16.

Rewrite it as `step_total_loop(n)`, which returns exactly the same values but uses **iteration** instead of recursion. It must not call `step_total`.

**[5 marks]**
--- hints
- Trace `step_total(4)` by hand first: 4 + 2 + 0. The values added go down by 2 until they reach 0 or below.
- A `while n > 0:` loop can do the same: add `n` to a running total, then subtract 2 from `n`.
--- starter
def step_total_loop(n):
    pass
--- solution
def step_total_loop(n):
    total = 0
    while n > 0:
        total = total + n
        n = n - 2
    return total
--- explanation
One mark each, up to 5:

- A total is initialised to 0 before the loop.
- A loop whose condition matches the base case (it continues while `n` is greater than 0).
- `n` is added to the total inside the loop.
- `n` is reduced by 2 each time round.
- The total is returned after the loop, and the function never calls itself or `step_total`.
