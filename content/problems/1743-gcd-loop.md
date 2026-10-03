--- meta
{"title": "Euclid's algorithm", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "gcd", "banned": ["math"],
  "tests": [
    {"args": [48, 18], "expected": 6},
    {"args": [7, 13], "expected": 1},
    {"args": [100, 25], "expected": 25},
    {"args": [0, 9], "expected": 9, "hidden": true},
    {"args": [270, 192], "expected": 6, "hidden": true}
  ]
}
--- description
The greatest common divisor (GCD) of two whole numbers is the biggest number that divides both. Euclid's algorithm finds it: while the second number is not 0, replace the pair `(a, b)` with `(b, a % b)`. The first number is then the GCD.

Write the function `gcd(a, b)` using a loop. For example, `gcd(48, 18)` returns `6`.
--- hints
- `while b != 0:` and then update both at once: `a, b = b, a % b`.
- Return `a` after the loop.
--- starter
def gcd(a, b):
    pass
--- solution
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
