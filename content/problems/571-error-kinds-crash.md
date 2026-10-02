--- meta
{"title": "What Kind of Error? (1)", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Types of error", "points": 5, "track": "debugging", "specRef": "3.3", "options": ["A syntax error", "A runtime error", "A logic error", "It is not an error"], "answer": 1}
--- description
A program asks how many people are sharing a £120 bill, then prints each person's share.

```python
people = int(input("How many people? "))
share = 120 / people
print(share)
```

It works for most inputs, but when the user types `0` it stops and shows an error message.

What kind of error is this?
--- hints
- The program started and ran its first line without complaint, so Python understood the code.
- The error only happens while the program is running, and only for one particular input.
--- explanation
This is a **runtime error**: the code is valid Python, but while running it was asked to do something impossible, dividing by zero.

- A *syntax error* breaks the rules of the language, so the program cannot start at all.
- A *runtime error* crashes a program that has already started.
- A *logic error* lets the program run to the end but gives the wrong result.

A robust program would check for 0 before dividing.
