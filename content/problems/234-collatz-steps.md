--- meta
{"title": "Hailstone Numbers", "kind": "CODE", "difficulty": "MEDIUM", "topic": "While loops", "points": 20, "track": "basics", "specRef": "2.2.1", "functionName": "collatz_steps",
  "tests": [
    {"args": [6], "expected": 8},
    {"args": [1], "expected": 0},
    {"args": [7], "expected": 16},
    {"args": [2], "expected": 1, "hidden": true},
    {"args": [27], "expected": 111, "hidden": true},
    {"args": [16], "expected": 4, "hidden": true},
    {"args": [3], "expected": 7, "hidden": true}
  ]
}
--- description
Start with any whole number greater than 0 and repeat this rule:

- if the number is even, halve it
- if it is odd, multiply it by 3 and add 1.

Sooner or later it always seems to reach 1. Nobody has ever proved why.

Write a function `collatz_steps(n)` that returns the number of steps needed to reach 1.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `collatz_steps(6)` | `8` | 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 |
| `collatz_steps(1)` | `0` | already there |
--- hints
- You do not know in advance how many steps there will be, so this needs a `while` loop: `while n != 1`.
- Inside the loop, change `n` according to the rule (use `//` so it stays a whole number) and add 1 to a counter.
--- starter
def collatz_steps(n):
    # Write your code here
    pass
--- solution
def collatz_steps(n):
    steps = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps
