--- meta
{
  "title": "Denary to Binary", "kind": "CODE", "difficulty": "EASY", "topic": "Binary", "points": 10, "track": "bits", "specRef": "1.4.1", "contest": "python-sprint",
  "functionName": "denary_to_binary", "banned": ["bin(", "format("],
  "tests": [
    { "args": [5, 8], "expected": "00000101" },
    { "args": [0, 4], "expected": "0000" },
    { "args": [255, 8], "expected": "11111111" },
    { "args": [1, 1], "expected": "1", "hidden": true },
    { "args": [10, 4], "expected": "1010", "hidden": true },
    { "args": [64, 8], "expected": "01000000", "hidden": true },
    { "args": [19, 5], "expected": "10011", "hidden": true }
  ]
}
--- description
Write a function `denary_to_binary(n, bits)` that returns the whole number `n` as an unsigned binary string exactly `bits` characters long, padded with leading zeros.

`n` is never negative and always fits in the number of bits given. `bin()` and `format()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `denary_to_binary(5, 8)` | `"00000101"` |
| `denary_to_binary(0, 4)` | `"0000"` |
| `denary_to_binary(255, 8)` | `"11111111"` |
--- hints
- `n % 2` is the last bit and `n // 2` removes it. Repeat `bits` times.
- Add each new bit to the **front** of the string: `result = str(n % 2) + result`.
--- starter
def denary_to_binary(n, bits):
    # Write your code here
    pass
--- solution
def denary_to_binary(n, bits):
    result = ""
    for _ in range(bits):
        result = str(n % 2) + result
        n = n // 2
    return result
