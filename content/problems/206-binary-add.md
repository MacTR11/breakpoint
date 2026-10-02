--- meta
{
  "title": "Binary Addition", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Binary", "points": 25, "track": "bits", "specRef": "1.4.1",
  "functionName": "binary_add", "banned": ["int(", "bin("],
  "tests": [
    { "args": ["1011", "0110"], "expected": "10001" },
    { "args": ["1", "1"], "expected": "10" },
    { "args": ["0", "0"], "expected": "0" },
    { "args": ["1111", "1"], "expected": "10000", "hidden": true },
    { "args": ["101", "10"], "expected": "111", "hidden": true },
    { "args": ["0011", "0001"], "expected": "100", "hidden": true },
    { "args": ["0", "1010"], "expected": "1010", "hidden": true },
    { "args": ["11111111", "11111111"], "expected": "111111110", "hidden": true }
  ]
}
--- description
Write a function `binary_add(a, b)` that adds two unsigned binary numbers, given as strings, and returns the answer as a binary string.

- The two strings may be different lengths.
- The answer should have no leading zeros, except that zero itself is `"0"`.

Add them column by column from the right with a carry, the way you would on paper. `int()` and `bin()` are not allowed.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `binary_add("1011", "0110")` | `"10001"` | 11 + 6 = 17 |
| `binary_add("1", "1")` | `"10"` | |
| `binary_add("0", "0")` | `"0"` | |
--- hints
- Pad the shorter string with zeros on the left (`.rjust(length, "0")`) so the columns line up.
- Work from the last character to the first with a `carry`. In each column the total is 0 to 3: the new bit is `total % 2` and the new carry is `total // 2`.
--- starter
def binary_add(a, b):
    # Write your code here
    pass
--- solution
def binary_add(a, b):
    length = max(len(a), len(b))
    a = a.rjust(length, "0")
    b = b.rjust(length, "0")
    result = ""
    carry = 0
    for i in range(length - 1, -1, -1):
        total = carry
        if a[i] == "1":
            total += 1
        if b[i] == "1":
            total += 1
        result = str(total % 2) + result
        carry = total // 2
    if carry:
        result = "1" + result
    result = result.lstrip("0")
    return result if result else "0"
