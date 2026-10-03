--- meta
{ "title": "What kind of test data?", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Testing", "points": 5, "track": "robust", "specRef": "3.3", "contest": "build-it-right",
  "options": ["Normal data", "Boundary data", "Erroneous data", "It is not useful test data"], "answer": 1 }
--- description
A program accepts ages from **11 to 18** inclusive.

A tester enters the value **18**. What kind of test data is this?
--- hints
- Is 18 inside the allowed range, outside it, or right on the edge?
--- explanation
18 is the largest value the program should accept, which makes it **boundary** data: a value at the very edge of the valid range.

Normal data would be something comfortably inside the range, such as 14. Erroneous data is something the program should reject, such as 30 or "abc".
