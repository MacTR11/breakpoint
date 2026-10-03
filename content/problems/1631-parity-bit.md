--- meta
{"title": "Even parity", "kind": "CODE", "difficulty": "EASY", "topic": "Error checking", "points": 10, "track": "bits", "specRef": "1.3.1", "functionName": "parity_bit", "banned": [".count("],
  "tests": [
    {"args": ["1011001"], "expected": "0"},
    {"args": ["0000000"], "expected": "0"},
    {"args": ["1111111"], "expected": "1"},
    {"args": ["1"], "expected": "1", "hidden": true},
    {"args": ["0"], "expected": "0", "hidden": true},
    {"args": ["1100"], "expected": "0", "hidden": true}
  ]
}
--- description
An even parity bit is added to some bits so that the total number of 1s, including the parity bit, is even. It lets the receiver spot a single bit that was flipped on the way.

Write the function `parity_bit(bits)`, where `bits` is a string of `"0"`s and `"1"`s. It returns `"0"` if the number of 1s is already even, and `"1"` if it is odd.

Count the 1s with a loop rather than `count`.
--- hints
- Loop over the characters and count those equal to `"1"`.
- The count is even when `count % 2 == 0`.
--- starter
def parity_bit(bits):
    pass
--- solution
def parity_bit(bits):
    ones = 0
    for bit in bits:
        if bit == "1":
            ones = ones + 1
    return "0" if ones % 2 == 0 else "1"
