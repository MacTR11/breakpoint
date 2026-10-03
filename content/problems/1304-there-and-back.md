--- meta
{"title": "There and back", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Recursion", "points": 20, "track": "recursion", "specRef": "2.2.1", "contest": "recursion-rumble", "check": "run", "options": ["5 3 1", "5 3 1 1 3 5", "1 3 5 5 3 1", "5 3 1 0 1 3 5"], "answer": 1}
--- description
```python
def f(n):
    if n <= 0:
        return
    print(n)
    f(n - 2)
    print(n)

f(5)
```

Which numbers does this program print, in order?
--- hints
- Each call prints `n`, then waits for the call inside it to finish completely, then prints `n` again.
- The call `f(-1)` prints nothing at all.
--- explanation
Each call prints its number on the way **in**, makes the recursive call, then prints its number again on the way back **out**.

- `f(5)` prints 5, then calls `f(3)`
- `f(3)` prints 3, then calls `f(1)`
- `f(1)` prints 1, then calls `f(-1)`, which returns straight away
- `f(1)` prints 1 again and finishes
- `f(3)` prints 3 again and finishes
- `f(5)` prints 5 again

The output is **5 3 1 1 3 5**. The second half comes from the calls unwinding off the call stack in reverse order.
