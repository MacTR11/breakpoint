--- meta
{"contest": "winter-cracker", "title": "What does it print: ho ho ho", "kind": "PUZZLE", "difficulty": "EASY", "topic": "String handling", "points": 5, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["HOHOHO 6 oho", "HOHOHO 3 oho", "HO HO HO 6 hoh", "hohoho 6 oho"], "answer": 0}
--- description
What does this program print?

```python
song = "ho" * 3
print(song.upper(), len(song), song[1:4])
```
--- hints
- Multiplying a string repeats it, with nothing in between: `"ab" * 2` is `"abab"`.
- `song[1:4]` is the characters at indexes 1, 2 and 3.
--- explanation
`"ho" * 3` is `"hohoho"`, 6 characters with no spaces. `.upper()` gives `HOHOHO`, and `song[1:4]` is indexes 1 to 3: `oho`.
