--- meta
{"title": "Every letter", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 10, "track": "strings", "specRef": "2.2.1", "functionName": "is_pangram",
  "tests": [
    {"args": ["The quick brown fox jumps over the lazy dog"], "expected": true},
    {"args": ["Hello world"], "expected": false},
    {"args": [""], "expected": false},
    {"args": ["abcdefghijklmnopqrstuvwxyz"], "expected": true, "hidden": true},
    {"args": ["Pack my box with five dozen liquor jugs!"], "expected": true, "hidden": true},
    {"args": ["ABCDEFGHIJKLMNOPQRSTUVWXY"], "expected": false, "hidden": true}
  ]
}
--- description
A pangram is a sentence that uses every letter of the alphabet at least once. Write the function `is_pangram(text)`, which returns `True` if `text` is a pangram, ignoring case, and `False` otherwise.
--- hints
- Loop over the 26 letters, `"abcdefghijklmnopqrstuvwxyz"`.
- Lower-case the text first. If any letter is missing from it, the answer is `False`.
--- starter
def is_pangram(text):
    pass
--- solution
def is_pangram(text):
    text = text.lower()
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if letter not in text:
            return False
    return True
