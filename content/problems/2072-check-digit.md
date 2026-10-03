--- meta
{"title": "String handling (b): calculate a check digit", "kind": "CODE", "difficulty": "MEDIUM", "topic": "String handling", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "check_digit",
  "tests": [
    {"args": ["4006381"], "expected": 2},
    {"args": ["0000000"], "expected": 0},
    {"args": ["1111111"], "expected": 5},
    {"args": ["9999999"], "expected": 5, "hidden": true},
    {"args": ["1234567"], "expected": 0, "hidden": true},
    {"args": ["5012345"], "expected": 2, "hidden": true},
    {"args": ["7300000"], "expected": 6, "hidden": true}
  ]
}
--- description
A shop gives each product a 7-digit code, stored as a string such as `"4006381"`. A check digit is added to the end so that mistyped codes can be detected. It is calculated like this:

1. Multiply the 1st, 3rd, 5th and 7th digits by 3.
2. Multiply the 2nd, 4th and 6th digits by 1.
3. Add all seven results together.
4. The check digit is the amount that must be added to that total to reach the next multiple of 10. If the total is already a multiple of 10, the check digit is 0.

Write the function `check_digit(code)`, which returns the check digit as an integer.

For example, for `"4006381"` the total is 12 + 0 + 0 + 6 + 9 + 8 + 3 = 38, so the check digit is `2`.

**[5 marks]**
--- hints
- Loop over the indexes 0 to 6. The 1st, 3rd, 5th and 7th digits are at the **even** indexes 0, 2, 4 and 6.
- `total MOD 10` is how far the total is past the last multiple of 10. The check digit is `10 - (total % 10)`, except that this gives 10 when the total is already a multiple of 10. Applying `% 10` once more fixes that.
--- starter
def check_digit(code):
    pass
--- solution
def check_digit(code):
    total = 0
    for index in range(len(code)):
        digit = int(code[index])
        if index % 2 == 0:
            total = total + digit * 3
        else:
            total = total + digit
    return (10 - total % 10) % 10
--- explanation
One mark each, up to 5:

- Loops through every character of the code.
- Converts each character to an integer.
- Multiplies the digits in the 1st, 3rd, 5th and 7th positions by 3, and the others by 1.
- Adds the results into a running total.
- Works out the distance to the next multiple of 10, giving 0 (not 10) when the total is already a multiple of 10.
