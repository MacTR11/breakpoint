--- meta
{
  "title": "Recursive Factorial", "kind": "CODE", "difficulty": "EASY", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1",
  "functionName": "factorial", "banned": ["math.factorial(", "import"],
  "tests": [
    { "args": [5], "expected": 120 },
    { "args": [0], "expected": 1 },
    { "args": [1], "expected": 1 },
    { "args": [3], "expected": 6, "hidden": true },
    { "args": [10], "expected": 3628800, "hidden": true },
    { "args": [12], "expected": 479001600, "hidden": true },
    { "args": [15], "expected": 1307674368000, "hidden": true }
  ]
}
--- description
The factorial of `n`, written `n!`, is `n × (n − 1) × … × 2 × 1`. By definition `0!` is `1`.

It can be defined **recursively**:

- base case: `factorial(0)` is `1`
- general case: `factorial(n)` is `n × factorial(n − 1)`

Write a function `factorial(n)` that returns `n!` for a whole number `n` of 0 or more. Try writing it so that the function calls itself.

### Examples

| Call | Returns |
| --- | --- |
| `factorial(5)` | `120` |
| `factorial(0)` | `1` |
--- hints
- Every recursive function needs a base case that stops it. Here that is `n == 0`, which returns 1.
- The general case is one line: `return n * factorial(n - 1)`.
--- starter
def factorial(n):
    # Write your code here
    pass
--- solution
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
