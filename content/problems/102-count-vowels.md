--- meta
{
  "title": "Count the vowels",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Strings",
  "points": 10,
  "track": "strings", "specRef": "2.2.1",
  "functionName": "count_vowels",
  "tests": [
    { "args": ["Computer"], "expected": 3 },
    { "args": ["PYTHON"], "expected": 1 },
    { "args": [""], "expected": 0 },
    { "args": ["AEIOUaeiou"], "expected": 10, "hidden": true },
    { "args": ["rhythm"], "expected": 0, "hidden": true },
    { "args": ["Sixth Form College"], "expected": 5, "hidden": true },
    { "args": ["queue"], "expected": 4, "hidden": true }
  ]
}
--- description
Write a function `count_vowels(text)` that returns how many vowels (`a`, `e`, `i`, `o`, `u`) appear in a string.

Count both upper-case and lower-case vowels.

### Examples

| Call | Returns |
| --- | --- |
| `count_vowels("Computer")` | `3` |
| `count_vowels("PYTHON")` | `1` |
--- hints
- Convert the text to lower case first with `.lower()`, so you only need to check for five letters.
- `letter in "aeiou"` is `True` when `letter` is a vowel. Count how many times that happens.
--- starter
def count_vowels(text):
    # Write your code here
    pass
--- solution
def count_vowels(text):
    return sum(1 for letter in text.lower() if letter in "aeiou")
