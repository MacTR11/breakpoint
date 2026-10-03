--- meta
{"title": "The longer word", "kind": "CODE", "difficulty": "EASY", "topic": "Selection", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "longer",
  "tests": [
    {"args": ["tram", "pier"], "expected": "tram"},
    {"args": ["sea", "tower"], "expected": "tower"},
    {"args": ["promenade", "sand"], "expected": "promenade"},
    {"args": ["a", "b"], "expected": "a", "hidden": true}
  ]
}
--- description
`longer(a, b)` should return whichever of the two words has more letters. If they are the same length, return `a`.
--- hints
- `len(word)` gives the number of letters.
- If `len(b)` is greater than `len(a)` return `b`; otherwise return `a`.
--- starter
def longer(a, b):
    if len(b) > len(a):
        return b
--- solution
def longer(a, b):
    if len(b) > len(a):
        return b
    return a
