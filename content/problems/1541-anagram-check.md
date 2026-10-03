--- meta
{"title": "Anagrams", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 10, "track": "strings", "specRef": "2.2.1", "functionName": "is_anagram",
  "tests": [
    {"args": ["listen", "silent"], "expected": true},
    {"args": ["Dormitory", "dirty room"], "expected": true},
    {"args": ["abc", "abd"], "expected": false},
    {"args": ["", ""], "expected": true, "hidden": true},
    {"args": ["aab", "abb"], "expected": false, "hidden": true},
    {"args": ["Astronomer", "Moon starer"], "expected": true, "hidden": true},
    {"args": ["night", "thing!"], "expected": false, "hidden": true}
  ]
}
--- description
Two phrases are anagrams if they use exactly the same letters the same number of times. Write the function `is_anagram(a, b)`, which returns `True` if `a` and `b` are anagrams, ignoring spaces and the difference between upper and lower case.

For example, `is_anagram("Dormitory", "dirty room")` returns `True`.
--- hints
- Tidy each phrase first: lower case, with the spaces taken out (`.replace(" ", "")`).
- Two tidied phrases are anagrams when their letters, sorted, are the same: `sorted(a) == sorted(b)`.
--- starter
def is_anagram(a, b):
    pass
--- solution
def is_anagram(a, b):
    a = a.lower().replace(" ", "")
    b = b.lower().replace(" ", "")
    return sorted(a) == sorted(b)
