--- meta
{
  "title": "Caesar Cipher",
  "kind": "CODE",
  "difficulty": "MEDIUM",
  "topic": "Strings",
  "points": 20,
  "track": "strings", "specRef": "1.3.1",
  "functionName": "caesar",
  "tests": [
    { "args": ["abc", 1], "expected": "bcd" },
    { "args": ["Hello, World!", 3], "expected": "Khoor, Zruog!" },
    { "args": ["xyz", 3], "expected": "abc" },
    { "args": ["Khoor, Zruog!", -3], "expected": "Hello, World!", "hidden": true },
    { "args": ["Python", 26], "expected": "Python", "hidden": true },
    { "args": ["Zebra", 27], "expected": "Afcsb", "hidden": true },
    { "args": ["", 5], "expected": "", "hidden": true },
    { "args": ["ABC xyz", -1], "expected": "ZAB wxy", "hidden": true }
  ]
}
--- description
A Caesar cipher shifts every letter along the alphabet by a fixed amount, wrapping round from `z` back to `a`.

Write a function `caesar(text, shift)` that returns the encrypted text.

- Upper-case letters stay upper case; lower-case letters stay lower case.
- Anything that is not a letter (spaces, digits, punctuation) is left unchanged.
- `shift` can be negative (to decrypt) or larger than 26.

### Examples

| Call | Returns |
| --- | --- |
| `caesar("abc", 1)` | `"bcd"` |
| `caesar("Hello, World!", 3)` | `"Khoor, Zruog!"` |
| `caesar("xyz", 3)` | `"abc"` |
--- hints
- `ord("a")` is 97 and `chr(97)` is `"a"`. Turn each letter into a number from 0 to 25 by subtracting the code of `"a"` (or `"A"` for capitals).
- Add the shift, use `% 26` to wrap round (it works for negative shifts too), then add the base back on and convert with `chr()`.
--- starter
def caesar(text, shift):
    # Write your code here
    pass
--- solution
def caesar(text, shift):
    result = ""
    for c in text:
        if c.isalpha() and c.isascii():
            base = ord("A") if c.isupper() else ord("a")
            result += chr((ord(c) - base + shift) % 26 + base)
        else:
            result += c
    return result
