--- meta
{"title": "Numbers from a messy file", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation and files", "points": 25, "track": "robust", "specRef": "3.3", "functionName": "read_numbers",
  "tests": [
    {"args": [["12", "", "7", "seven", "-4", " 3 "]], "expected": [[12, 7, -4, 3], 1]},
    {"args": [[]], "expected": [[], 0]},
    {"args": [["1", "2", "3"]], "expected": [[1, 2, 3], 0]},
    {"args": [["x", "y", ""]], "expected": [[], 2], "hidden": true},
    {"args": [["10.5", "0", "+2", "08"]], "expected": [[0, 8], 2], "hidden": true}
  ]
}
--- description
A sensor writes one reading per line to a text file, but some lines are blank and some are corrupted. The lines have been read into a list of strings.

Write the function `read_numbers(lines)`, which returns a list of two things:

1. a list of the whole numbers found, in order (spaces at either end of a line are ignored, and a number may start with `-`)
2. how many lines were skipped because they were not whole numbers. Blank lines are not counted as skipped.

For example, `read_numbers(["12", "", "7", "seven", "-4", " 3 "])` returns `[[12, 7, -4, 3], 1]`.
--- hints
- Strip each line first. If it is empty, move straight on to the next line.
- A whole number is digits, optionally after one `-`. Checking `text[1:].isdigit()` when the text starts with `-` handles that. Anything else adds 1 to the skipped count.
--- starter
def read_numbers(lines):
    pass
--- solution
def read_numbers(lines):
    numbers = []
    skipped = 0
    for line in lines:
        text = line.strip()
        if text == "":
            continue
        digits = text[1:] if text.startswith("-") else text
        if digits.isdigit():
            numbers.append(int(text))
        else:
            skipped = skipped + 1
    return [numbers, skipped]
