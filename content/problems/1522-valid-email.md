--- meta
{"title": "Is it an email address?", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 25, "track": "robust", "specRef": "3.3", "functionName": "looks_like_email",
  "tests": [
    {"args": ["ada@example.com"], "expected": true},
    {"args": ["ada.example.com"], "expected": false},
    {"args": ["ada@example"], "expected": false},
    {"args": ["@example.com"], "expected": false},
    {"args": ["ada@@example.com"], "expected": false, "hidden": true},
    {"args": ["ada@example."], "expected": false, "hidden": true},
    {"args": ["a da@example.com"], "expected": false, "hidden": true},
    {"args": ["x@y.z"], "expected": true, "hidden": true},
    {"args": ["ada@.com"], "expected": false, "hidden": true}
  ]
}
--- description
A sign-up form makes a rough check of email addresses before accepting them. Write the function `looks_like_email(text)`, which returns `True` only if:

- there is exactly one `@`
- there is at least one character before the `@`
- after the `@` there is a `.` that is neither straight after the `@` nor the last character
- there are no spaces anywhere.

Otherwise it returns `False`.
--- hints
- `text.count("@")` must be exactly 1. Then `text.split("@")` gives the part before and the part after.
- For the part after: it must contain a `.`, must not start with one, and must not end with one.
--- starter
def looks_like_email(text):
    pass
--- solution
def looks_like_email(text):
    if " " in text or text.count("@") != 1:
        return False
    before, after = text.split("@")
    if before == "":
        return False
    if "." not in after or after.startswith(".") or after.endswith("."):
        return False
    return True
