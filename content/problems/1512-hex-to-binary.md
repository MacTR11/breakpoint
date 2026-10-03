--- meta
{"title": "Hex to binary", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Hexadecimal", "points": 25, "track": "bits", "specRef": "1.4.1", "functionName": "hex_to_binary", "banned": ["bin(", "format(", "int("],
  "tests": [
    {"args": ["3F"], "expected": "00111111"},
    {"args": ["A"], "expected": "1010"},
    {"args": ["00"], "expected": "00000000"},
    {"args": ["FF"], "expected": "11111111", "hidden": true},
    {"args": ["b7"], "expected": "10110111", "hidden": true},
    {"args": ["1234"], "expected": "0001001000110100", "hidden": true},
    {"args": ["c0de"], "expected": "1100000011011110", "hidden": true}
  ]
}
--- description
Each hexadecimal digit stands for exactly four bits. Write the function `hex_to_binary(hex_string)`, which returns the binary string, four bits for every hex digit.

For example, `hex_to_binary("3F")` returns `"00111111"`, and `hex_to_binary("A")` returns `"1010"`. Letters may be upper or lower case.

Do the conversion yourself: do not use `int`, `bin` or `format`.
--- hints
- Keep a string of the sixteen digits in order, `"0123456789ABCDEF"`. The position of a digit in that string is its value: `.index()` finds it.
- Turn each value from 0 to 15 into four bits, either with a lookup table or by checking 8, 4, 2 and 1 in turn.
--- starter
def hex_to_binary(hex_string):
    pass
--- solution
def hex_to_binary(hex_string):
    digits = "0123456789ABCDEF"
    bits = ""
    for ch in hex_string.upper():
        value = digits.index(ch)
        for weight in [8, 4, 2, 1]:
            if value >= weight:
                bits = bits + "1"
                value = value - weight
            else:
                bits = bits + "0"
    return bits
