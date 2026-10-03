--- meta
{"title": "Fibonacci, fast", "kind": "CODE", "difficulty": "HARD", "topic": "Recursion and memoisation", "points": 50, "track": "recursion", "specRef": "2.2.1", "functionName": "fib",
  "tests": [
    {"args": [0], "expected": 0},
    {"args": [1], "expected": 1},
    {"args": [10], "expected": 55},
    {"args": [30], "expected": 832040, "hidden": true},
    {"args": [60], "expected": 1548008755920, "hidden": true},
    {"args": [90], "expected": 2880067194370816120, "hidden": true}
  ]
}
--- description
The Fibonacci numbers start 0, 1, and each one after that is the sum of the two before: 0, 1, 1, 2, 3, 5, 8...

Write the function `fib(n)`, which returns the `n`th Fibonacci number, counting from `fib(0) = 0`.

The simple recursive version is far too slow for large `n`: `fib(90)` must come back within a second. Either remember the values you have already worked out (memoisation), or use a loop.
--- hints
- The plain recursion works out the same values again and again: `fib(30)` calls `fib(2)` hundreds of thousands of times.
- Keep a dictionary of answers already found and check it before recursing. Or keep just the last two numbers in a loop, adding them to move along.
--- starter
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
--- solution
def fib(n, known={}):
    if n < 2:
        return n
    if n not in known:
        known[n] = fib(n - 1) + fib(n - 2)
    return known[n]
