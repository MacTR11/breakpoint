--- meta
{ "title": "String handling", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "strings", "specRef": "2.2.1",
  "options": ["LGOR9", "GORI8", "gori9", "GORI9"], "answer": 3 }
--- description
In OCR Exam Reference Language, `text.substring(start, count)` returns `count` characters of `text` beginning at position `start`, where the first character is at position 0.

```
word = "Algorithm"
print(word.substring(2, 4).upper + str(word.length))
```

What is printed?
--- hints
- Positions start at 0, so position 2 is the third character.
- The second number is how many characters to take, not where to stop.
--- explanation
Number the characters from 0:

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | l | g | o | r | i | t | h | m |

Four characters starting at position 2 are `gori`, and `.upper` makes that `GORI`.

The word has 9 characters, so `str(word.length)` is `"9"`. Joined together, the output is **GORI9**.
