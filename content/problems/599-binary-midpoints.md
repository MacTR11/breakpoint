--- meta
{"title": "Which items get checked?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Binary search", "points": 10, "track": "searching", "specRef": "2.3.1", "options": ["21, 30, 26", "21, 35, 30, 26", "17, 26", "21, 26"], "answer": 0}
--- description
A binary search looks for **26** in this sorted list of nine items. It finds the middle with `mid = (low + high) DIV 2`.

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Value | 3 | 8 | 12 | 17 | 21 | 26 | 30 | 35 | 41 |

Which values does it examine, in order?
--- hints
- Start with `low = 0` and `high = 8`, so the first `mid` is 4.
- 21 is too small, so `low` becomes 5. Now work out the next `mid`.
--- explanation
- `low = 0`, `high = 8`: `mid` is 4, value **21**. Too small, so `low` becomes 5.
- `low = 5`, `high = 8`: `mid` is 6, value **30**. Too big, so `high` becomes 5.
- `low = 5`, `high = 5`: `mid` is 5, value **26**. Found.

It examines **21, 30, 26**: three items out of nine.
