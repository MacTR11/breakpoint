--- meta
{"title": "Pixel images (b): decode a row", "kind": "CODE", "difficulty": "EASY", "topic": "Run-length encoding", "points": 20, "track": "exam", "specRef": "1.3.1", "functionName": "decode_row", "banned": ["*"],
  "tests": [
    {"args": [[[0, 2], [1, 3], [0, 1]]], "expected": [0, 0, 1, 1, 1, 0]},
    {"args": [[]], "expected": []},
    {"args": [[[1, 4]]], "expected": [1, 1, 1, 1]},
    {"args": [[[0, 1], [1, 1], [0, 1]]], "expected": [0, 1, 0], "hidden": true},
    {"args": [[[1, 0], [0, 2]]], "expected": [0, 0], "hidden": true}
  ]
}
--- description
A simple drawing program stores black-and-white images as rows of pixels. Each pixel is `1` (black) or `0` (white), so a row is a list such as `[0, 0, 1, 1, 1, 0]`.

Write the function `decode_row(runs)`, which turns a run-length encoding back into the row of pixels. For example, `decode_row([[0, 2], [1, 3], [0, 1]])` returns `[0, 0, 1, 1, 1, 0]`.

Use loops: do not use `*` to repeat lists.

**[4 marks]**
--- hints
- Loop over the pairs: `for value, count in runs:`.
- For each pair, append `value` to the row `count` times with an inner loop.
--- starter
def decode_row(runs):
    pass
--- solution
def decode_row(runs):
    pixels = []
    for value, count in runs:
        for i in range(count):
            pixels.append(value)
    return pixels
--- explanation
One mark each, up to 4:

- Loops over every pair.
- Takes the value and the count from each pair.
- Appends the value the right number of times.
- Returns the whole row, in order.
