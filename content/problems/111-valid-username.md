--- meta
{
  "title": "Username Validation", "kind": "CODE", "difficulty": "EASY", "topic": "Validation", "points": 10, "track": "robust", "specRef": "3.3",
  "functionName": "valid_username",
  "tests": [
    { "args": ["alice"], "expected": true },
    { "args": ["bob"], "expected": false },
    { "args": ["al1ce_99"], "expected": true },
    { "args": ["abcdefghijkl"], "expected": true, "hidden": true },
    { "args": ["abcdefghijklm"], "expected": false, "hidden": true },
    { "args": ["abcd"], "expected": false, "hidden": true },
    { "args": ["1alice"], "expected": false, "hidden": true },
    { "args": ["alice!"], "expected": false, "hidden": true },
    { "args": [""], "expected": false, "hidden": true },
    { "args": ["_alice"], "expected": false, "hidden": true },
    { "args": ["Alice_B"], "expected": true, "hidden": true },
    { "args": ["ali ce"], "expected": false, "hidden": true }
  ]
}
--- description
Your project needs a sign-up form. A username is valid when **all** of these are true:

- it is between 5 and 12 characters long, inclusive (a *length check*)
- its first character is a letter `a`–`z` or `A`–`Z`
- every character is a letter, a digit `0`–`9` or an underscore `_` (a *format check*)

Write a function `valid_username(username)` that returns `True` or `False`.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `valid_username("alice")` | `True` | exactly 5 characters: a boundary value |
| `valid_username("bob")` | `False` | too short |
| `valid_username("al1ce_99")` | `True` | |

The hidden tests use normal, boundary and erroneous data, just as your own test plan should.
--- hints
- Check the length first: `len(username) < 5 or len(username) > 12` means it is invalid.
- Build a string of every allowed character and check that each character of the username is `in` it. Check `username[0]` after the length check, so an empty string cannot crash it.
--- starter
def valid_username(username):
    # Write your code here
    pass
--- solution
def valid_username(username):
    letters = "abcdefghijklmnopqrstuvwxyz"
    allowed = letters + letters.upper() + "0123456789_"
    if len(username) < 5 or len(username) > 12:
        return False
    if username[0].lower() not in letters:
        return False
    for character in username:
        if character not in allowed:
            return False
    return True
