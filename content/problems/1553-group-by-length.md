--- meta
{"title": "Group by length", "kind": "CODE", "difficulty": "EASY", "topic": "Dictionaries", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "by_length",
  "tests": [
    {"args": [["tram", "pier", "sea", "tower", "sand"]], "expected": {"4": ["tram", "pier", "sand"], "3": ["sea"], "5": ["tower"]}},
    {"args": [[]], "expected": {}},
    {"args": [["a"]], "expected": {"1": ["a"]}},
    {"args": [["one", "two", "six"]], "expected": {"3": ["one", "two", "six"]}, "hidden": true},
    {"args": [["Blackpool", "Lytham", "Fleetwood"]], "expected": {"9": ["Blackpool", "Fleetwood"], "6": ["Lytham"]}, "hidden": true}
  ]
}
--- description
Write the function `by_length(words)`, which returns a dictionary. Each key is a word length, and its value is a list of the words of that length, in the order they appear.

For example, `by_length(["tram", "pier", "sea", "tower", "sand"])` returns `{4: ["tram", "pier", "sand"], 3: ["sea"], 5: ["tower"]}`.
--- hints
- `len(word)` is the key. The first time you meet a length, store an empty list for it.
- Append each word to the list for its length, in the order the words come.
--- starter
def by_length(words):
    pass
--- solution
def by_length(words):
    groups = {}
    for word in words:
        if len(word) not in groups:
            groups[len(word)] = []
        groups[len(word)].append(word)
    return groups
