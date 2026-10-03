--- meta
{"title": "Reading a mark", "kind": "CODE", "difficulty": "EASY", "topic": "Validation", "points": 10, "track": "robust", "specRef": "3.3", "functionName": "parse_mark",
  "tests": [
    {"args": ["42"], "expected": 42},
    {"args": [" 7 "], "expected": 7},
    {"args": ["101"], "expected": null},
    {"args": ["-3"], "expected": null},
    {"args": ["4.5"], "expected": null, "hidden": true},
    {"args": [""], "expected": null, "hidden": true},
    {"args": ["abc"], "expected": null, "hidden": true},
    {"args": ["100"], "expected": 100, "hidden": true},
    {"args": ["0"], "expected": 0, "hidden": true}
  ]
}
--- description
A teacher types marks into a form, and the program receives each one as a string. Write the function `parse_mark(text)`, which returns the mark as an integer if the text is a whole number from 0 to 100, ignoring spaces at either end. Otherwise it returns `None`.

The function must never crash.

| `text` | returns |
| --- | --- |
| `"42"` | `42` |
| `" 7 "` | `7` |
| `"101"` | `None` |
| `"4.5"` | `None` |
--- hints
- `text.strip()` removes the spaces at each end.
- `.isdigit()` is `True` only for one or more digits, so it rejects `""`, `"-3"` and `"4.5"`. Only call `int()` once that check has passed, then check the range.
--- starter
def parse_mark(text):
    pass
--- solution
def parse_mark(text):
    text = text.strip()
    if not text.isdigit():
        return None
    mark = int(text)
    if mark > 100:
        return None
    return mark
