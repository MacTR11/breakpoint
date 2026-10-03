--- meta
{"title": "Strings times numbers", "kind": "PUZZLE", "difficulty": "EASY", "topic": "String operations", "points": 5, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["ababab 6", "ab3 3", "ababab 3", "Error"], "answer": 0}
--- description
```python
part = "ab"
whole = part * 3
print(whole, len(whole))
```

What does this program print?
--- hints
- Multiplying a string by a whole number repeats it.
- Then count the characters.
--- explanation
`"ab" * 3` repeats the string three times: `"ababab"`, which has 6 characters. It prints `ababab 6`.
