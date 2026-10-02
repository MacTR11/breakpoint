--- meta
{"title": "Slice of a Slice", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Strings", "points": 10, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["pyt", "noh", "hon", "typ"], "answer": 1}
--- description
```python
word = "python"
print(word[::-1][0:3])
```

What does this program print?
--- hints
- `word[::-1]` is the whole string backwards.
- Work out the reversed string first, then take its first three characters.
--- explanation
`word[::-1]` steps through the string backwards, giving `"nohtyp"`.

`[0:3]` then takes the first three characters of that: **noh**.
