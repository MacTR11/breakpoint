--- meta
{"title": "An average that survives bad data", "kind": "CODE", "difficulty": "EASY", "topic": "Validation", "points": 10, "track": "robust", "specRef": "3.3", "functionName": "average_valid",
  "tests": [
    {"args": [["4", "seven", "6", "", " 5 "]], "expected": 5.0},
    {"args": [[]], "expected": null},
    {"args": [["x", "y"]], "expected": null},
    {"args": [["10"]], "expected": 10.0, "hidden": true},
    {"args": [["-2", "2", "3.5"]], "expected": 0.0, "hidden": true}
  ]
}
--- description
Write the function `average_valid(entries)`, where `entries` is a list of strings typed by users. It returns the mean of the entries that are whole numbers (spaces at either end are allowed, and a number may start with `-`), rounded to 1 decimal place. Everything else is ignored. If there are no whole numbers at all, it returns `None`.

For example, `average_valid(["4", "seven", "6", "", " 5 "])` returns `5.0`.
--- hints
- Strip each entry, then decide whether it is a whole number: digits, perhaps after a single `-`.
- Keep a total and a count of the good ones. Return `None` before dividing if the count is 0.
--- starter
def average_valid(entries):
    pass
--- solution
def average_valid(entries):
    total = 0
    count = 0
    for entry in entries:
        text = entry.strip()
        digits = text[1:] if text.startswith("-") else text
        if digits.isdigit():
            total = total + int(text)
            count = count + 1
    if count == 0:
        return None
    return round(total / count, 1)
