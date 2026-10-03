--- meta
{"title": "A mobile number, tidied", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 25, "track": "robust", "specRef": "3.3", "functionName": "clean_mobile",
  "tests": [
    {"args": ["07700 900123"], "expected": "07700900123"},
    {"args": ["+44 7700 900123"], "expected": "07700900123"},
    {"args": ["07700-900-123"], "expected": "07700900123"},
    {"args": ["0770090012"], "expected": null},
    {"args": ["01253 123456"], "expected": null, "hidden": true},
    {"args": ["+44 (0)7700 900123"], "expected": "07700900123", "hidden": true},
    {"args": ["phone me"], "expected": null, "hidden": true},
    {"args": [""], "expected": null, "hidden": true},
    {"args": ["447700900123"], "expected": null, "hidden": true}
  ]
}
--- description
A sign-up form takes a UK mobile number, which people type in many ways. Write the function `clean_mobile(text)`, which returns the number as 11 digits starting `07`, or `None` if it is not a UK mobile number.

To tidy it:

- remove spaces, hyphens and brackets
- a number starting `+44` has the `+44` replaced by `0`; if that leaves `00`, the extra `0` (as in `+44 (0)7700...`) is removed
- after tidying it must be exactly 11 digits and start `07`.

| `text` | returns |
| --- | --- |
| `"07700 900123"` | `"07700900123"` |
| `"+44 7700 900123"` | `"07700900123"` |
| `"01253 123456"` | `None` (a landline) |
--- hints
- Build a new string from the characters that are not spaces, hyphens or brackets.
- Then deal with `+44`: replace it with `0`, and if the result starts with `00`, drop one 0. Finally check `.isdigit()`, the length, and the start.
--- starter
def clean_mobile(text):
    pass
--- solution
def clean_mobile(text):
    number = ""
    for ch in text:
        if ch not in " -()":
            number = number + ch
    if number.startswith("+44"):
        number = "0" + number[3:]
        if number.startswith("00"):
            number = number[1:]
    if number.isdigit() and len(number) == 11 and number.startswith("07"):
        return number
    return None
