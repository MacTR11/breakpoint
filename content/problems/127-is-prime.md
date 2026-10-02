--- meta
{"title": "Prime Numbers", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "is_prime",
  "tests": [
    {"args": [7], "expected": true},
    {"args": [8], "expected": false},
    {"args": [1], "expected": false},
    {"args": [2], "expected": true, "hidden": true},
    {"args": [0], "expected": false, "hidden": true},
    {"args": [97], "expected": true, "hidden": true},
    {"args": [91], "expected": false, "hidden": true},
    {"args": [25], "expected": false, "hidden": true},
    {"args": [3], "expected": true, "hidden": true}
  ]
}
--- description
A prime number is a whole number greater than 1 that divides exactly only by 1 and itself.

Write a function `is_prime(n)` that returns `True` if `n` is prime and `False` otherwise. `n` is a whole number of 0 or more.

### Examples

| Call | Returns |
| --- | --- |
| `is_prime(7)` | `True` |
| `is_prime(8)` | `False` |
| `is_prime(1)` | `False` |
--- hints
- Deal with numbers below 2 first: none of them are prime.
- Try dividing `n` by every number from 2 up to `n - 1`. If any divides exactly (`n % d == 0`) it is not prime. Only return `True` after the loop has finished.
--- starter
def is_prime(n):
    # Write your code here
    pass
--- solution
def is_prime(n):
    if n < 2:
        return False
    for divisor in range(2, n):
        if n % divisor == 0:
            return False
    return True
