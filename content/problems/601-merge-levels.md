--- meta
{"title": "Splitting in half", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Merge sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "options": ["2", "4", "8", "16"], "answer": 1}
--- description
Merge sort splits a list in half, then splits each half in half, and so on until every piece holds a single item.

For a list of **16** items, how many rounds of splitting are needed?
--- hints
- After one round there are two lists of 8. After two rounds, four lists of 4.
--- explanation
16 → 8 → 4 → 2 → 1

It takes **4** rounds, because 2⁴ = 16. In general the number of levels is log₂ n, and each level involves merging all n items, which is where merge sort's O(n log n) comes from.
