--- meta
{"title": "String handling (d): check a password", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "strong_password",
  "tests": [
    {"args": ["Tower2024"], "expected": true},
    {"args": ["tower2024"], "expected": false},
    {"args": ["Tow3r"], "expected": false},
    {"args": ["TOWER2024"], "expected": false},
    {"args": ["TowerTower"], "expected": false, "hidden": true},
    {"args": ["aB3defgh"], "expected": true, "hidden": true},
    {"args": [""], "expected": false, "hidden": true},
    {"args": ["12345678"], "expected": false, "hidden": true},
    {"args": ["Pass word1"], "expected": false, "hidden": true},
    {"args": ["zzzzzzzZ9"], "expected": true, "hidden": true}
  ]
}
--- description
A website accepts a new password only if **all** of these are true:

- it is at least 8 characters long
- it contains at least one upper case letter
- it contains at least one lower case letter
- it contains at least one digit
- it contains no spaces.

Write the function `strong_password(password)`, which returns `True` if the password is accepted and `False` if it is not.

**[6 marks]**
--- hints
- Use three Boolean flags, all starting as `False`: one each for upper case, lower case and digit. Loop through the characters and set a flag to `True` when you see that kind of character.
- `ch.isupper()`, `ch.islower()` and `ch.isdigit()` test a single character. A space can be checked with `ch == " "`.
--- starter
def strong_password(password):
    pass
--- solution
def strong_password(password):
    if len(password) < 8:
        return False
    has_upper = False
    has_lower = False
    has_digit = False
    for ch in password:
        if ch == " ":
            return False
        if ch.isupper():
            has_upper = True
        elif ch.islower():
            has_lower = True
        elif ch.isdigit():
            has_digit = True
    return has_upper and has_lower and has_digit
--- explanation
One mark each, up to 6:

- Checks the length is at least 8.
- Examines every character of the password.
- Detects an upper case letter.
- Detects a lower case letter and a digit.
- Rejects a password containing a space.
- Returns `True` only when all five rules are met.
