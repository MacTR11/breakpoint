--- meta
{"title": "Capital count", "kind": "CODE", "difficulty": "EASY", "topic": "Strings", "points": 10, "track": "strings", "specRef": "2.2.1", "contest": "python-sprint", "functionName": "count_upper",
  "tests": [
    {"args": ["Hello World"], "expected": 2},
    {"args": ["abc"], "expected": 0},
    {"args": [""], "expected": 0},
    {"args": ["ABC"], "expected": 3, "hidden": true},
    {"args": ["a1B2"], "expected": 1, "hidden": true},
    {"args": ["PyThOn 3"], "expected": 3, "hidden": true}
  ]
}
--- description
Write a function `count_upper(text)` that returns how many upper-case letters `A`–`Z` are in `text`.

### Examples

| Call | Returns |
| --- | --- |
| `count_upper("Hello World")` | `2` |
| `count_upper("abc")` | `0` |
--- hints
- `character.isupper()` is `True` for a capital letter.
- Loop through the characters and add 1 to a counter each time one is upper case.
--- starter
def count_upper(text):
    # Write your code here
    pass
--- solution
def count_upper(text):
    count = 0
    for character in text:
        if "A" <= character <= "Z":
            count += 1
    return count
