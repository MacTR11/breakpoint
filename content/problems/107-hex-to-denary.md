--- meta
{
  "title": "Hex to Denary", "kind": "CODE", "difficulty": "EASY", "topic": "Hexadecimal", "points": 10, "track": "bits", "specRef": "1.4.1",
  "functionName": "hex_to_denary",
  "tests": [
    { "args": ["FF"], "expected": 255 },
    { "args": ["1A"], "expected": 26 },
    { "args": ["0"], "expected": 0 },
    { "args": ["7f"], "expected": 127, "hidden": true },
    { "args": ["100"], "expected": 256, "hidden": true },
    { "args": ["ABC"], "expected": 2748, "hidden": true },
    { "args": ["10"], "expected": 16, "hidden": true }
  ]
}
--- description
Write a function `hex_to_denary(hex_string)` that converts a hexadecimal string into the denary (base 10) integer it represents.

The digits `A` to `F` stand for 10 to 15, and may be given in upper or lower case.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `hex_to_denary("FF")` | `255` | 15 × 16 + 15 |
| `hex_to_denary("1A")` | `26` | 1 × 16 + 10 |

### Challenge

`int(hex_string, 16)` does this in one line. Can you do it with place values instead?
--- hints
- The string `"0123456789ABCDEF"` is useful: the position of each character in it is that digit's value.
- For each character, multiply the total so far by 16 and add the digit's value. Handle lower case with `.upper()`.
--- starter
def hex_to_denary(hex_string):
    # Write your code here
    pass
--- solution
def hex_to_denary(hex_string):
    digits = "0123456789ABCDEF"
    total = 0
    for character in hex_string.upper():
        total = total * 16 + digits.index(character)
    return total
