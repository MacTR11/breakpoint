--- meta
{"title": "Count the Calls", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "contest": "recursion-rumble", "check": "run", "options": ["4", "5", "8", "9"], "answer": 3}
--- description
```python
calls = 0

def fib(n):
    global calls
    calls += 1
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

fib(4)
print(calls)
```

What does this program print?
--- hints
- Draw the calls as a tree: `fib(4)` calls `fib(3)` and `fib(2)`, each of which makes two more calls, and so on.
- `fib(1)` and `fib(0)` each count as one call and make no more.
--- explanation
Count the calls from the bottom up:

- `fib(0)` and `fib(1)`: 1 call each
- `fib(2)`: itself + `fib(1)` + `fib(0)` = 3 calls
- `fib(3)`: itself + `fib(2)` + `fib(1)` = 1 + 3 + 1 = 5 calls
- `fib(4)`: itself + `fib(3)` + `fib(2)` = 1 + 5 + 3 = **9** calls

The same values are worked out again and again, which is why this version of Fibonacci becomes painfully slow: its time complexity is exponential.
