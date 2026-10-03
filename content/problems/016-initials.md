--- meta
{"title": "Initials", "kind": "CODE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "initials",
  "tests": [
    {"args": ["Ada", "Lovelace"], "expected": "A.L."},
    {"args": ["alan", "turing"], "expected": "A.T."},
    {"args": ["Mo", "Li"], "expected": "M.L."},
    {"args": ["grace", "Hopper"], "expected": "G.H.", "hidden": true}
  ]
}
--- description
`initials(first, last)` should return the two initials in capitals, each followed by a full stop.

For example, `initials("Ada", "Lovelace")` returns `"A.L."` and `initials("alan", "turing")` returns `"A.T."`.
--- hints
- `first[0]` is the first letter of the first name. `.upper()` makes it a capital.
- Join the four pieces with `+`: the first initial, `"."`, the second initial, `"."`.
--- starter
def initials(first, last):
    return first[0]
--- solution
def initials(first, last):
    return first[0].upper() + "." + last[0].upper() + "."
