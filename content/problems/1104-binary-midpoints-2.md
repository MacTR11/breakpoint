--- meta
{"title": "Follow the search", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Binary search", "points": 10, "track": "searching", "specRef": "2.3.1", "contest": "sort-it-out", "options": ["27, 9, 14", "27, 14", "20, 9, 14", "27, 9, 20, 14"], "answer": 0}
--- description
A binary search looks for **14** in this sorted list of eleven items. It finds the middle with `mid = (low + high) DIV 2`.

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Value | 2 | 5 | 9 | 14 | 20 | 27 | 33 | 40 | 48 | 55 | 61 |

Which values does it examine, in order?
--- hints
- `low` starts at 0 and `high` at 10, so the first `mid` is 5.
- After 27 is found to be too big, `high` becomes 4.
--- explanation
- `low = 0`, `high = 10`: `mid` is 5, value **27**. Too big, so `high` becomes 4.
- `low = 0`, `high = 4`: `mid` is 2, value **9**. Too small, so `low` becomes 3.
- `low = 3`, `high = 4`: `mid` is 3, value **14**. Found.

It examines **27, 9, 14**.
