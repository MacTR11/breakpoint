--- meta
{
  "title": "Binary to Denary",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Binary",
  "points": 10,
  "track": "bits", "specRef": "1.4.1",
  "functionName": "binary_to_denary",
  "tests": [
    { "args": ["1011"], "expected": 11 },
    { "args": ["0"], "expected": 0 },
    { "args": ["11111111"], "expected": 255 },
    { "args": ["1"], "expected": 1, "hidden": true },
    { "args": ["10000000"], "expected": 128, "hidden": true },
    { "args": ["0001"], "expected": 1, "hidden": true },
    { "args": ["101010"], "expected": 42, "hidden": true },
    { "args": ["1100100"], "expected": 100, "hidden": true }
  ]
}
--- description
Write a function `binary_to_denary(bits)` that takes a string of `0`s and `1`s and returns the denary (base 10) integer it represents.

### Examples

| Call | Returns |
| --- | --- |
| `binary_to_denary("1011")` | `11` |
| `binary_to_denary("11111111")` | `255` |

### Challenge

Python can do this in one line with `int(bits, 2)`. Can you do it **without** that, using place values?
--- hints
- Work from left to right: for each bit, double the total so far and then add the bit.
- `total = total * 2 + int(bit)` inside a loop over the string does the whole conversion.
--- starter
def binary_to_denary(bits):
    # Write your code here
    pass
--- solution
def binary_to_denary(bits):
    total = 0
    for bit in bits:
        total = total * 2 + (1 if bit == "1" else 0)
    return total
