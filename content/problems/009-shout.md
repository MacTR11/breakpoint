--- meta
{"title": "Shout", "kind": "CODE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "shout",
  "tests": [
    {"args": ["hello"], "expected": "HELLO!"},
    {"args": ["Stop"], "expected": "STOP!"},
    {"args": ["tram coming"], "expected": "TRAM COMING!"},
    {"args": [""], "expected": "!", "hidden": true},
    {"args": ["ALREADY LOUD"], "expected": "ALREADY LOUD!", "hidden": true},
    {"args": ["42"], "expected": "42!", "hidden": true}
  ]
}
--- description
`shout(text)` should return the text in capital letters with an exclamation mark on the end.

For example, `shout("hello")` returns `"HELLO!"`.
--- hints
- `text.upper()` gives a copy of the text in capitals.
- Join `"!"` on the end with `+`.
--- starter
def shout(text):
    return text
--- solution
def shout(text):
    return text.upper() + "!"
