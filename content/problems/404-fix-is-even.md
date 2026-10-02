--- meta
{
  "title": "Fix: Even Numbers", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Logic error", "points": 10, "track": "debugging", "specRef": "3.3", "contest": "welcome",
  "functionName": "is_even",
  "tests": [
    { "args": [4], "expected": true },
    { "args": [7], "expected": false },
    { "args": [0], "expected": true },
    { "args": [-2], "expected": true, "hidden": true },
    { "args": [1], "expected": false, "hidden": true },
    { "args": [100], "expected": true, "hidden": true }
  ]
}
--- description
`is_even(n)` should return `True` when the whole number `n` is even and `False` when it is odd.

It runs without crashing, but it gives the wrong answers. Find the bug and fix it.
--- hints
- Run the examples. Every answer is the opposite of what it should be.
- What is the remainder when an **even** number is divided by 2?
--- starter
def is_even(n):
    if n % 2 == 1:
        return True
    else:
        return False
--- solution
def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False
