--- meta
{"title": "Fix: counting long words", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Boundary errors", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "count_long",
  "tests": [
    {"args": [["sea", "promenade", "tram", "illuminations", "tower"]], "expected": 2},
    {"args": [[]], "expected": 0},
    {"args": [["a", "bb", "ccccc", "dddddd"]], "expected": 1},
    {"args": [["window", "pierhead", "sands"]], "expected": 2, "hidden": true}
  ]
}
--- description
`count_long(words)` should return how many words have **more than** 5 letters.

It counts some words that it should not. There is **one** bug.
--- hints
- Which word in the first example is counted when it should not be? Count its letters.
- A word with exactly 5 letters does not have more than 5. Check the comparison.
--- starter
def count_long(words):
    count = 0
    for word in words:
        if len(word) >= 5:
            count = count + 1
    return count
--- solution
def count_long(words):
    count = 0
    for word in words:
        if len(word) > 5:
            count = count + 1
    return count
