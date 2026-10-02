--- meta
{"title": "Full name", "kind": "CODE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "full_name",
  "tests": [
    {"args": ["Ada", "Lovelace"], "expected": "Ada Lovelace"},
    {"args": ["Alan", "Turing"], "expected": "Alan Turing"},
    {"args": ["A", "B"], "expected": "A B"},
    {"args": ["Mary", "Jackson"], "expected": "Mary Jackson", "hidden": true},
    {"args": ["", ""], "expected": " ", "hidden": true},
    {"args": ["Tim", "Berners-Lee"], "expected": "Tim Berners-Lee", "hidden": true}
  ]
}
--- description
`full_name(first, last)` should return the two names joined together with one space between them.

For example, `full_name("Ada", "Lovelace")` returns `"Ada Lovelace"`.
--- hints
- A space is a string too: `" "`.
- Join the three pieces with `+`: the first name, a space, the last name.
--- starter
def full_name(first, last):
    return first + last
--- solution
def full_name(first, last):
    return first + " " + last
