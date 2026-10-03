--- meta
{
  "title": "Two's Complement", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Binary", "points": 25, "track": "bits", "specRef": "1.4.1",
  "functionName": "twos_complement",
  "tests": [
    { "args": [5, 8], "expected": "00000101" },
    { "args": [-5, 8], "expected": "11111011" },
    { "args": [-1, 4], "expected": "1111" },
    { "args": [0, 8], "expected": "00000000", "hidden": true },
    { "args": [-128, 8], "expected": "10000000", "hidden": true },
    { "args": [127, 8], "expected": "01111111", "hidden": true },
    { "args": [-8, 4], "expected": "1000", "hidden": true },
    { "args": [7, 4], "expected": "0111", "hidden": true }
  ]
}
--- description
Two's complement is how computers store negative integers. The most significant bit has a **negative** place value: in 8 bits the place values are −128, 64, 32, 16, 8, 4, 2, 1.

Write a function `twos_complement(value, bits)` that returns `value` as a two's complement binary string exactly `bits` characters long.

`value` will always fit in the number of bits given.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `twos_complement(5, 8)` | `"00000101"` | |
| `twos_complement(-5, 8)` | `"11111011"` | −128 + 64 + 32 + 16 + 8 + 2 + 1 |
| `twos_complement(-1, 4)` | `"1111"` | −8 + 4 + 2 + 1 |
--- hints
- A positive number is ordinary binary padded with zeros. Get the bits by repeatedly taking `value % 2` and dividing by 2.
- For a negative number, add `2 ** bits` to it first, then convert the result as if it were positive.
--- starter
def twos_complement(value, bits):
    # Write your code here
    pass
--- solution
def twos_complement(value, bits):
    if value < 0:
        value = value + 2 ** bits
    result = ""
    for _ in range(bits):
        result = str(value % 2) + result
        value = value // 2
    return result
