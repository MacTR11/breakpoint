--- meta
{"title": "Indexing", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "strings", "specRef": "2.2.1", "contest": "python-sprint", "check": "run", "options": ["Cg9", "Cn9", "Cg8", "C9"], "answer": 0}
--- description
```python
s = "Computing"
print(s[0] + s[-1] + str(len(s)))
```

What does this program print?
--- hints
- A negative index counts from the end: `s[-1]` is the last character.
--- explanation
`s[0]` is the first character, `C`. `s[-1]` is the last, `g`. The word has 9 letters, and `str(9)` is `"9"`.

Joined together: **Cg9**.
