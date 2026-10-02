--- meta
{
  "title": "Bitwise Masks", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Bitwise operations", "points": 25, "track": "bits", "specRef": "1.4.1",
  "functionName": "apply_mask",
  "tests": [
    { "args": ["10110110", "00001111", "AND"], "expected": "00000110" },
    { "args": ["10110110", "00001111", "OR"], "expected": "10111111" },
    { "args": ["10110110", "00001111", "XOR"], "expected": "10111001" },
    { "args": ["1111", "0000", "AND"], "expected": "0000", "hidden": true },
    { "args": ["1010", "0101", "OR"], "expected": "1111", "hidden": true },
    { "args": ["1010", "1010", "XOR"], "expected": "0000", "hidden": true },
    { "args": ["0", "1", "XOR"], "expected": "1", "hidden": true },
    { "args": ["11001100", "11110000", "AND"], "expected": "11000000", "hidden": true }
  ]
}
--- description
A **mask** is a bit pattern combined with a value to switch chosen bits off, switch them on, or flip them.

- `AND` with a mask keeps the bits where the mask is `1` and clears the rest.
- `OR` with a mask sets the bits where the mask is `1`.
- `XOR` with a mask flips the bits where the mask is `1`.

Write a function `apply_mask(value, mask, operation)`. `value` and `mask` are binary strings of the same length, and `operation` is `"AND"`, `"OR"` or `"XOR"`. Return the result as a binary string of that same length.

### Examples

| Call | Returns |
| --- | --- |
| `apply_mask("10110110", "00001111", "AND")` | `"00000110"` |
| `apply_mask("10110110", "00001111", "OR")` | `"10111111"` |
| `apply_mask("10110110", "00001111", "XOR")` | `"10111001"` |
--- hints
- Go through the two strings together, one pair of bits at a time: `for v, m in zip(value, mask)`.
- AND gives 1 only when both bits are 1, OR when at least one is, XOR when the two bits are different.
--- starter
def apply_mask(value, mask, operation):
    # Write your code here
    pass
--- solution
def apply_mask(value, mask, operation):
    result = ""
    for v, m in zip(value, mask):
        if operation == "AND":
            bit = v == "1" and m == "1"
        elif operation == "OR":
            bit = v == "1" or m == "1"
        else:
            bit = v != m
        result += "1" if bit else "0"
    return result
