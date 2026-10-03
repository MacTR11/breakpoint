--- meta
{"title": "What kind of error? (3)", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Types of error", "points": 5, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "options": ["A syntax error", "A runtime error", "A logic error", "A rounding error"], "answer": 0}
--- description
```python
total = 14
print("Total: " + str(total)
```

When this program is run, Python refuses to start it and reports a problem with the second line.

What kind of error is this?
--- hints
- Count the brackets on the second line.
--- explanation
The closing bracket of `print(` is missing. The code breaks the rules of the language, so Python cannot even begin to run it: a **syntax error**.

Runtime errors happen while a program is running, and logic errors let it finish with the wrong result. Neither applies here, because not one line was executed.
