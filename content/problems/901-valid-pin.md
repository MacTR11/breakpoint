--- meta
{
  "title": "PIN check", "kind": "CODE", "difficulty": "EASY", "topic": "Validation", "points": 10, "track": "robust", "specRef": "3.3", "contest": "build-it-right",
  "functionName": "valid_pin",
  "tests": [
    { "args": ["1234"], "expected": true },
    { "args": ["123"], "expected": false },
    { "args": ["12a4"], "expected": false },
    { "args": ["0000"], "expected": true, "hidden": true },
    { "args": ["12345"], "expected": false, "hidden": true },
    { "args": [""], "expected": false, "hidden": true },
    { "args": [" 123"], "expected": false, "hidden": true },
    { "args": ["-123"], "expected": false, "hidden": true },
    { "args": ["9999"], "expected": true, "hidden": true }
  ]
}
--- description
Write a function `valid_pin(pin)` that returns `True` if the string `pin` is exactly four characters long and every character is a digit `0`–`9`. Otherwise return `False`.

That is a **length check** and a **type check** in one function.

### Examples

| Call | Returns | Kind of test data |
| --- | --- | --- |
| `valid_pin("1234")` | `True` | normal |
| `valid_pin("123")` | `False` | boundary: one character short |
| `valid_pin("12a4")` | `False` | erroneous |
--- hints
- Check `len(pin) != 4` first.
- Then make sure every character is `in "0123456789"`.
--- starter
def valid_pin(pin):
    # Write your code here
    pass
--- solution
def valid_pin(pin):
    if len(pin) != 4:
        return False
    for character in pin:
        if character not in "0123456789":
            return False
    return True
