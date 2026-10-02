--- meta
{"title": "Fix: Vowel Counter", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Logic errors", "points": 10, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "functionName": "count_vowels",
  "tests": [
    {"args": ["banana"], "expected": 3},
    {"args": ["APPLE"], "expected": 2},
    {"args": [""], "expected": 0},
    {"args": ["xyz"], "expected": 0, "hidden": true},
    {"args": ["Queue"], "expected": 4, "hidden": true},
    {"args": ["aEiOu"], "expected": 5, "hidden": true}
  ]
}
--- description
`count_vowels(text)` should return how many vowels (a, e, i, o, u) are in `text`, counting both upper and lower case.

There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- `count_vowels("banana")` returns 1. Look at what happens to `count` each time a vowel is found.
- `"A" in "aeiou"` is `False`. Capital letters need handling too.
--- starter
def count_vowels(text):
    count = 0
    for letter in text:
        if letter in "aeiou":
            count = 1
    return count
--- solution
def count_vowels(text):
    count = 0
    for letter in text.lower():
        if letter in "aeiou":
            count = count + 1
    return count
