--- meta
{"title": "Always yes", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Boolean logic", "points": 10, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["Yes", "No", "Nothing", "An error"], "answer": 0}
--- description
```python
answer = "n"
if answer == "y" or "Y":
    print("Yes")
else:
    print("No")
```

What does this program print?
--- hints
- Python reads the condition as two separate tests joined by `or`. What is the second test?
- Any non-empty string counts as true when used as a condition.
--- explanation
Python reads the condition as `(answer == "y") or ("Y")`. The first part is false, but the second part is just the string `"Y"`, and a non-empty string always counts as true. So the condition is always true and the program prints **Yes**, whatever the answer was.

Each side of an `or` must be a complete test: `answer == "y" or answer == "Y"`.
