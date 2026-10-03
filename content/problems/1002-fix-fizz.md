--- meta
{"title": "Fix: FizzBuzz", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Order of conditions", "points": 20, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "functionName": "fizz_buzz",
  "tests": [
    {"args": [3], "expected": "Fizz"},
    {"args": [15], "expected": "FizzBuzz"},
    {"args": [7], "expected": "7"},
    {"args": [5], "expected": "Buzz", "hidden": true},
    {"args": [30], "expected": "FizzBuzz", "hidden": true},
    {"args": [1], "expected": "1", "hidden": true},
    {"args": [9], "expected": "Fizz", "hidden": true}
  ]
}
--- description
`fizz_buzz(n)` should return `"Fizz"` for a multiple of 3, `"Buzz"` for a multiple of 5, `"FizzBuzz"` for a multiple of both, and otherwise the number itself **as a string**.

There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- 15 is a multiple of 3, so the first condition catches it before the `FizzBuzz` test is ever reached. The order of the tests matters.
- Check the type of what is returned for 7. The tests expect `"7"`, not `7`.
--- starter
def fizz_buzz(n):
    if n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    elif n % 15 == 0:
        return "FizzBuzz"
    else:
        return n
--- solution
def fizz_buzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)
