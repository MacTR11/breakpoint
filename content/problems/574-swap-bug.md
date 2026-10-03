--- meta
{"title": "The broken swap", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Tracing", "points": 5, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["5 9", "9 5", "9 9", "5 5"], "answer": 2}
--- description
A student writes this to swap the values of two variables.

```python
a = 5
b = 9
a = b
b = a
print(a, b)
```

What does it print?
--- hints
- Trace it one line at a time, writing down the value of `a` and `b` after each line.
- After `a = b`, where is the 5 stored?
--- explanation
After `a = b`, both variables hold 9. The original 5 has been overwritten and is gone, so `b = a` just copies 9 back again. The program prints **9 9**.

A swap needs somewhere to keep the first value safe: `temp = a`, then `a = b`, then `b = temp`. Python also allows `a, b = b, a`.
