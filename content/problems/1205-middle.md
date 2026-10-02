--- meta
{"title": "The Middle", "kind": "CODE", "difficulty": "EASY", "topic": "Strings", "points": 10, "track": "strings", "specRef": "2.2.1", "contest": "python-sprint", "functionName": "middle",
  "tests": [
    {"args": ["abc"], "expected": "b"},
    {"args": ["abcd"], "expected": "bc"},
    {"args": [""], "expected": ""},
    {"args": ["a"], "expected": "a", "hidden": true},
    {"args": ["ab"], "expected": "ab", "hidden": true},
    {"args": ["python"], "expected": "th", "hidden": true},
    {"args": ["hello"], "expected": "l", "hidden": true}
  ]
}
--- description
Write a function `middle(text)` that returns the middle of a string:

- the single middle character if the length is odd
- the middle **two** characters if the length is even
- an empty string if `text` is empty.

### Examples

| Call | Returns |
| --- | --- |
| `middle("abc")` | `"b"` |
| `middle("abcd")` | `"bc"` |
--- hints
- `len(text) // 2` is the index of the middle character when the length is odd.
- When the length is even, you want the character at that index and the one **before** it: a slice from `half - 1` to `half + 1`.
--- starter
def middle(text):
    # Write your code here
    pass
--- solution
def middle(text):
    half = len(text) // 2
    if len(text) % 2 == 1:
        return text[half]
    return text[half - 1:half + 1]
