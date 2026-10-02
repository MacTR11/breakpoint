--- meta
{ "title": "Choosing Test Data", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Testing", "points": 5, "track": "robust", "specRef": "3.3",
  "options": ["35 and 50", "0 and 80", "−20 and 200", "\"forty\" and an empty input"], "answer": 1 }
--- description
A program accepts exam marks from **0 to 80** inclusive.

Which pair of values is **boundary** test data?
--- hints
- Boundary data is at the very edge of what is accepted.
--- explanation
Boundary data sits at the very edges of what is allowed: here, **0 and 80**. Off-by-one mistakes such as writing `<` instead of `<=` only show up at the edges, which is why they need testing.

The others are different kinds of test data: 35 and 50 are *normal* data, while −20, 200, "forty" and an empty input are *erroneous* data that the program should reject.

A good test plan uses all three kinds.
