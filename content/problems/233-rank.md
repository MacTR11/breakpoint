--- meta
{
  "title": "Leaderboard Order", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting records", "points": 20, "track": "sorting", "specRef": "2.3.1",
  "functionName": "rank", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[["Ava", 70], ["Ben", 85], ["Cal", 62]]], "expected": [["Ben", 85], ["Ava", 70], ["Cal", 62]] },
    { "args": [[["Zed", 50], ["Amy", 50]]], "expected": [["Amy", 50], ["Zed", 50]] },
    { "args": [[]], "expected": [] },
    { "args": [[["A", 1]]], "expected": [["A", 1]], "hidden": true },
    { "args": [[["B", 2], ["A", 2], ["C", 3]]], "expected": [["C", 3], ["A", 2], ["B", 2]], "hidden": true },
    { "args": [[["x", -1], ["y", 0], ["w", -1]]], "expected": [["y", 0], ["w", -1], ["x", -1]], "hidden": true },
    { "args": [[["Dee", 10], ["Cy", 20], ["Bo", 30], ["Al", 40]]], "expected": [["Al", 40], ["Bo", 30], ["Cy", 20], ["Dee", 10]], "hidden": true }
  ]
}
--- description
Real sorting is rarely just a list of numbers. Here each record is a list `[name, score]`.

Write a function `rank(records)` that returns the records in leaderboard order:

- highest score first
- where scores are equal, in alphabetical order of name.

Write the sort yourself, adapting one of the algorithms you know. `sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `rank([["Ava", 70], ["Ben", 85], ["Cal", 62]])` | `[["Ben", 85], ["Ava", 70], ["Cal", 62]]` |
| `rank([["Zed", 50], ["Amy", 50]])` | `[["Amy", 50], ["Zed", 50]]` |
--- hints
- Write a small helper `comes_before(a, b)` that returns `True` when record `a` should be above record `b`: a higher score, or the same score and an earlier name.
- Take any sort you have written, such as insertion sort, and replace its comparison of two items with a call to that helper.
--- starter
def rank(records):
    # Write your code here
    pass
--- solution
def comes_before(a, b):
    if a[1] != b[1]:
        return a[1] > b[1]
    return a[0] < b[0]


def rank(records):
    records = list(records)
    for i in range(1, len(records)):
        current = records[i]
        j = i - 1
        while j >= 0 and comes_before(current, records[j]):
            records[j + 1] = records[j]
            j -= 1
        records[j + 1] = current
    return records
