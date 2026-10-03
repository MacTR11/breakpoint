--- meta
{"title": "Adding up the inputs", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Data types", "points": 5, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["15", "123", "36", "An error"], "answer": 1}
--- description
The `input()` function always gives back a **string**. This program shows what happens when two inputs of `12` and `3` are added without converting them.

```python
a = "12"
b = "3"
print(a + b)
```

What does it print?
--- hints
- What does `+` do when both sides are strings?
--- explanation
With two strings, `+` joins them end to end (concatenation), so the result is the string **123**.

To add them as numbers they must be converted first: `int(a) + int(b)` gives 15. Forgetting to convert an input is one of the most common bugs in early programs.
