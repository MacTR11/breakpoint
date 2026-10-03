--- meta
{"title": "String methods", "kind": "PUZZLE", "difficulty": "EASY", "topic": "String methods", "points": 5, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["TRAM-ROAD 2", "tram-road 2", "TRAM ROAD 1", "TRAM-ROAD 1"], "answer": 0}
--- description
```python
place = "  tram road  "
tidy = place.strip().upper().replace(" ", "-")
print(tidy, tidy.count("R"))
```

What does this program print?
--- hints
- Apply the methods left to right: `strip`, then `upper`, then `replace`.
- `count` is case sensitive, and by then everything is in capitals.
--- explanation
`strip()` removes the outer spaces to give `"tram road"`, `upper()` gives `"TRAM ROAD"`, and `replace` turns the space into a hyphen: `"TRAM-ROAD"`. There are two capital Rs. It prints `TRAM-ROAD 2`.
