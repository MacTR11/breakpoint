--- meta
{"title": "Pixel images (c): a byte in hex", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Binary and hexadecimal", "points": 30, "track": "exam", "specRef": "1.4.1", "functionName": "byte_to_hex", "banned": ["hex(", "format(", "int(", "bin("],
  "tests": [
    {"args": [[1, 0, 1, 1, 0, 0, 0, 1]], "expected": "B1"},
    {"args": [[0, 0, 0, 0, 0, 0, 0, 0]], "expected": "00"},
    {"args": [[1, 1, 1, 1, 1, 1, 1, 1]], "expected": "FF"},
    {"args": [[0, 0, 0, 0, 1, 0, 1, 0]], "expected": "0A", "hidden": true},
    {"args": [[1, 0, 0, 1, 1, 1, 0, 0]], "expected": "9C", "hidden": true},
    {"args": [[0, 1, 1, 1, 1, 1, 1, 1]], "expected": "7F", "hidden": true}
  ]
}
--- description
A simple drawing program stores black-and-white images as rows of pixels. Each pixel is `1` (black) or `0` (white), so a row is a list such as `[0, 0, 1, 1, 1, 0]`.

Eight pixels make one byte. The program shows bytes as two hexadecimal digits: the first four pixels give the first digit and the last four give the second.

Write the function `byte_to_hex(pixels)`, where `pixels` is a list of exactly eight 0s and 1s. It returns the two hex digits as a string, using capital letters. For example, `byte_to_hex([1, 0, 1, 1, 0, 0, 0, 1])` returns `"B1"`.

Do the conversion yourself: do not use `hex`, `int`, `bin` or `format`.

**[6 marks]**
--- hints
- Each group of four bits has place values 8, 4, 2 and 1. Multiply each bit by its place value and add them to get a number from 0 to 15.
- Turn 0 to 15 into a digit with the string `"0123456789ABCDEF"`: the digit for `n` is at index `n`.
--- starter
def byte_to_hex(pixels):
    pass
--- solution
def byte_to_hex(pixels):
    digits = "0123456789ABCDEF"
    result = ""
    for start in [0, 4]:
        value = 0
        for bit in pixels[start:start + 4]:
            value = value * 2 + bit
        result = result + digits[value]
    return result
--- explanation
One mark each, up to 6:

- Splits the eight bits into two groups of four, the first giving the first digit.
- Uses the place values 8, 4, 2 and 1 (or doubling) within each group.
- Works out a value from 0 to 15 for each group.
- Converts values 10 to 15 into the letters A to F.
- Joins the two digits in the right order.
- Returns them as a string.
