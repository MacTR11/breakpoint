--- meta
{"title": "Fix: key error", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Dictionary error", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "letter_count",
  "tests": [
    {"args": ["aab"], "expected": {"a": 2, "b": 1}},
    {"args": [""], "expected": {}},
    {"args": ["zz"], "expected": {"z": 2}},
    {"args": ["abc"], "expected": {"a": 1, "b": 1, "c": 1}, "hidden": true},
    {"args": ["a a"], "expected": {"a": 2, " ": 1}, "hidden": true}
  ]
}
--- description
`letter_count(text)` should return a dictionary showing how many times each character appears in `text`.

It crashes with a `KeyError` on the very first character.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- `counts[letter] += 1` means: look up the current count, add 1, and store it. What is the current count for a letter that has never been seen?
- Check `if letter in counts` first. If it is not there yet, start it at 1 instead of adding to it.
--- starter
def letter_count(text):
    counts = {}
    for letter in text:
        counts[letter] += 1
    return counts
--- solution
def letter_count(text):
    counts = {}
    for letter in text:
        if letter in counts:
            counts[letter] += 1
        else:
            counts[letter] = 1
    return counts
