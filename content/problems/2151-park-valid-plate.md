--- meta
{"title": "Car park (a): check a number plate", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "valid_plate",
  "tests": [
    {"args": ["AB12 CDE"], "expected": true},
    {"args": ["ab12 cde"], "expected": false},
    {"args": ["AB12CDE"], "expected": false},
    {"args": ["A812 CDE"], "expected": false},
    {"args": ["AB12 CD3"], "expected": false, "hidden": true},
    {"args": ["AB1 2CDE"], "expected": false, "hidden": true},
    {"args": [""], "expected": false, "hidden": true},
    {"args": ["XY99 ZZZ"], "expected": true, "hidden": true},
    {"args": ["AB12 CDEF"], "expected": false, "hidden": true}
  ]
}
--- description
A seafront car park records cars by their number plate. Plates are strings such as `"AB12 CDE"`: two capital letters, two digits, a space, then three capital letters.

Write the function `valid_plate(text)`, which returns `True` only if `text` is in exactly that form, and `False` otherwise. Lower-case letters are not accepted.

**[5 marks]**
--- hints
- Check the length (8) and the space at index 4 first.
- Then check each position: indexes 0, 1, 5, 6 and 7 must be capital letters (`"A" <= ch <= "Z"`), and indexes 2 and 3 must be digits.
--- starter
def valid_plate(text):
    pass
--- solution
def valid_plate(text):
    if len(text) != 8 or text[4] != " ":
        return False
    for i in [0, 1, 5, 6, 7]:
        if not ("A" <= text[i] <= "Z"):
            return False
    for i in [2, 3]:
        if not text[i].isdigit():
            return False
    return True
--- explanation
One mark each, up to 5:

- Checks the length is exactly 8.
- Checks for the space in the fifth position.
- Checks the first two characters are capital letters.
- Checks the third and fourth characters are digits.
- Checks the last three characters are capital letters, and returns `True` only when every check passes.
