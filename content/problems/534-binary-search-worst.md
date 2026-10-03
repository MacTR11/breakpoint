--- meta
{ "title": "Halving the problem", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Searching", "points": 10, "track": "searching", "specRef": "2.3.1",
  "options": ["500", "10", "1000", "100"], "answer": 1 }
--- description
A sorted list contains **1000** items.

In the worst case, how many items does a **binary search** need to examine to find a target, or to be sure it is not there?
--- hints
- Each item examined halves what is left: 1000, 500, 250 and so on.
- Find the smallest power of 2 that is bigger than 1000.
--- explanation
Each item examined lets binary search throw away half of what is left: 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1.

That is **10** items, because 2¹⁰ = 1024 is the first power of two above 1000. This is what O(log n) means in practice. A linear search of the same list could need all 1000.
