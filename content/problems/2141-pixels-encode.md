--- meta
{"title": "Pixel images (a): run-length encode a row", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Run-length encoding", "points": 25, "track": "exam", "specRef": "1.3.1", "functionName": "encode_row",
  "tests": [
    {"args": [[0, 0, 1, 1, 1, 0]], "expected": [[0, 2], [1, 3], [0, 1]]},
    {"args": [[1]], "expected": [[1, 1]]},
    {"args": [[]], "expected": []},
    {"args": [[1, 1, 1, 1]], "expected": [[1, 4]], "hidden": true},
    {"args": [[0, 1, 0, 1]], "expected": [[0, 1], [1, 1], [0, 1], [1, 1]], "hidden": true},
    {"args": [[1, 1, 0, 0, 0, 0, 0, 1, 1, 1]], "expected": [[1, 2], [0, 5], [1, 3]], "hidden": true}
  ]
}
--- description
A simple drawing program stores black-and-white images as rows of pixels. Each pixel is `1` (black) or `0` (white), so a row is a list such as `[0, 0, 1, 1, 1, 0]`.

To save space, each row is stored using **run-length encoding**: a list of `[value, count]` pairs, one for each run of identical pixels.

Write the function `encode_row(pixels)`, which returns the run-length encoding of a row. For example, `encode_row([0, 0, 1, 1, 1, 0])` returns `[[0, 2], [1, 3], [0, 1]]`. An empty row gives `[]`.

**[5 marks]**
--- hints
- Keep the value of the current run and how long it is so far.
- When the next pixel is different, the run has ended: add `[value, count]` to the result and start a new run. Remember to add the last run after the loop.
--- starter
def encode_row(pixels):
    pass
--- solution
def encode_row(pixels):
    runs = []
    for pixel in pixels:
        if len(runs) > 0 and runs[-1][0] == pixel:
            runs[-1][1] = runs[-1][1] + 1
        else:
            runs.append([pixel, 1])
    return runs
--- explanation
One mark each, up to 5:

- Goes through every pixel in order.
- Recognises when a pixel continues the current run.
- Increases the count for that run.
- Starts a new run with a count of 1 when the value changes.
- Returns every run, including the last, as `[value, count]` pairs.
