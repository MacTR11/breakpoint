--- meta
{
  "title": "Robust Age Input", "kind": "CODE", "difficulty": "EASY", "topic": "Validation", "points": 10, "track": "robust", "specRef": "3.3",
  "functionName": "parse_age",
  "tests": [
    { "args": ["42"], "expected": 42 },
    { "args": ["abc"], "expected": -1 },
    { "args": [" 17 "], "expected": 17 },
    { "args": [""], "expected": -1, "hidden": true },
    { "args": ["0"], "expected": 0, "hidden": true },
    { "args": ["120"], "expected": 120, "hidden": true },
    { "args": ["121"], "expected": -1, "hidden": true },
    { "args": ["-3"], "expected": -1, "hidden": true },
    { "args": ["12.5"], "expected": -1, "hidden": true },
    { "args": ["007"], "expected": 7, "hidden": true },
    { "args": ["   "], "expected": -1, "hidden": true },
    { "args": ["4 2"], "expected": -1, "hidden": true }
  ]
}
--- description
Users type all sorts of things into an input box. Robust code copes with every one of them without crashing.

Write a function `parse_age(text)` that takes what the user typed, as a string, and returns their age as an integer.

- Spaces at the start or end should be ignored.
- The age must be a whole number from 0 to 120 inclusive.
- For anything else, return `-1`. The function must never raise an error.

### Examples

| Call | Returns | Kind of test data |
| --- | --- | --- |
| `parse_age("42")` | `42` | normal |
| `parse_age(" 17 ")` | `17` | normal, with stray spaces |
| `parse_age("abc")` | `-1` | erroneous |
--- hints
- `text.strip()` removes spaces from both ends. Deal with an empty result before anything else.
- Check that every character is a digit **before** calling `int()`, so it can never raise an error. Then check the upper limit of 120.
--- starter
def parse_age(text):
    # Write your code here
    pass
--- solution
def parse_age(text):
    cleaned = text.strip()
    if cleaned == "":
        return -1
    for character in cleaned:
        if character not in "0123456789":
            return -1
    age = int(cleaned)
    if age > 120:
        return -1
    return age
