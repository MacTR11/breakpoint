--- meta
{"title": "How deep does it go?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "check": "run", "options": ["3", "4", "5", "10"], "answer": 1}
--- description
```python
def f(n):
    if n == 0:
        return 0
    return 1 + f(n // 2)

print(f(10))
```

What does this program print?
--- hints
- Write down the argument of each call: 10, then `10 // 2`, and so on until it reaches 0.
- Each call that is not the base case adds 1.
--- explanation
The calls are `f(10)`, `f(5)`, `f(2)`, `f(1)` and `f(0)`.

`f(0)` returns 0, and each of the four calls above it adds 1, so the answer is **4**.

The function counts how many times a number can be halved before it reaches 0, which is the same reason binary search is so fast.
