--- meta
{"contest": "upper-sixth-challenge", "title": "What does it print: unwinding", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Recursion", "points": 20, "track": "recursion", "specRef": "2.2.1", "check": "run", "options": ["3 2 1 10 20 30", "3 30 2 20 1 10", "3 2 1 30 20 10", "1 2 3 10 20 30"], "answer": 0}
--- description
What does this program print?

```python
def show(n):
    if n > 0:
        print(n, end=" ")
        show(n - 1)
        print(n * 10, end=" ")

show(3)
```
--- hints
- Each call prints its first number, then waits for the call inside it to finish completely before printing its second.
- The last call to start (n = 1) is the first to finish.
--- explanation
On the way down each call prints n before calling the next: `3 2 1`. `show(0)` does nothing. Then the calls finish in the opposite order, newest first, each printing n × 10: `10 20 30`.

Anything after the recursive call happens as the stack of calls unwinds, in reverse.
