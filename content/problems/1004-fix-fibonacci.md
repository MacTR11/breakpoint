--- meta
{"title": "Fix: Fibonacci", "kind": "CODE", "style": "FIX", "difficulty": "HARD", "topic": "Recursion errors", "points": 40, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "functionName": "fib",
  "tests": [
    {"args": [0], "expected": 0},
    {"args": [1], "expected": 1},
    {"args": [6], "expected": 8},
    {"args": [2], "expected": 1, "hidden": true},
    {"args": [3], "expected": 2, "hidden": true},
    {"args": [10], "expected": 55, "hidden": true},
    {"args": [15], "expected": 610, "hidden": true}
  ]
}
--- description
The Fibonacci sequence starts 0, 1, 1, 2, 3, 5, 8, … Each number is the sum of the two before it.

`fib(n)` should return the number at position `n`, where `fib(0)` is 0 and `fib(1)` is 1.

There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- Check the base case against the definition: what should `fib(0)` return? What does it return?
- Each number is the sum of the **two before it**: positions `n - 1` and `n - 2`.
--- starter
def fib(n):
    if n <= 1:
        return 1
    return fib(n - 1) + fib(n - 3)
--- solution
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
