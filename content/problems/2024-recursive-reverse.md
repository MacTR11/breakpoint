--- meta
{"title": "Recursion (d): reverse a string", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "reverse_text", "banned": ["[::-1]", "reversed(", "for ", "while "],
  "tests": [
    {"args": ["tram"], "expected": "mart"},
    {"args": [""], "expected": ""},
    {"args": ["a"], "expected": "a"},
    {"args": ["Blackpool"], "expected": "loopkcalB", "hidden": true},
    {"args": ["level"], "expected": "level", "hidden": true},
    {"args": ["ab cd"], "expected": "dc ba", "hidden": true}
  ]
}
--- description
Write a **recursive** function `reverse_text(text)` that returns the characters of `text` in reverse order.

Do not use a loop, slicing with a negative step, or `reversed`.

For example, `reverse_text("tram")` returns `"mart"`.

**[4 marks]**
--- hints
- A string of length 0 or 1 is already its own reverse. That is the base case.
- The reverse of a longer string is the reverse of everything after the first character, with the first character joined on the end: `reverse_text(text[1:]) + text[0]`.
--- starter
def reverse_text(text):
    pass
--- solution
def reverse_text(text):
    if len(text) <= 1:
        return text
    return reverse_text(text[1:]) + text[0]
--- explanation
One mark each, up to 4:

- A base case for a string that is empty (or one character long).
- The base case returns that string unchanged.
- A recursive call on the string with one character removed.
- The removed character is joined on at the opposite end, and the result returned.
