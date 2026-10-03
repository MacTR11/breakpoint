--- meta
{
  "title": "Palindrome checker",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Strings",
  "points": 10,
  "track": "strings", "specRef": "2.2.1",
  "functionName": "is_palindrome",
  "tests": [
    { "args": ["Racecar"], "expected": true },
    { "args": ["Python"], "expected": false },
    { "args": ["A man, a plan, a canal: Panama"], "expected": true },
    { "args": [""], "expected": true, "hidden": true },
    { "args": ["No lemon, no melon"], "expected": true, "hidden": true },
    { "args": ["ab"], "expected": false, "hidden": true },
    { "args": ["12321"], "expected": true, "hidden": true },
    { "args": ["Was it a car or a cat I saw?"], "expected": true, "hidden": true },
    { "args": ["0P"], "expected": false, "hidden": true }
  ]
}
--- description
A palindrome reads the same forwards and backwards.

Write a function `is_palindrome(text)` that returns `True` if `text` is a palindrome and `False` otherwise.

- Ignore the difference between upper and lower case.
- Ignore spaces and punctuation: only letters and digits count.
- An empty string counts as a palindrome.

### Examples

| Call | Returns |
| --- | --- |
| `is_palindrome("Racecar")` | `True` |
| `is_palindrome("Python")` | `False` |
| `is_palindrome("A man, a plan, a canal: Panama")` | `True` |
--- hints
- `"a".isalnum()` is `True` and `",".isalnum()` is `False`. Use it to keep only the letters and digits.
- Build a cleaned, lower-case version of the text, then compare it with itself reversed: `cleaned == cleaned[::-1]`.
--- starter
def is_palindrome(text):
    # Write your code here
    pass
--- solution
def is_palindrome(text):
    cleaned = [c.lower() for c in text if c.isalnum()]
    return cleaned == cleaned[::-1]
