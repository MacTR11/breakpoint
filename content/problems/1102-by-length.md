--- meta
{"title": "Shortest First", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 25, "track": "sorting", "specRef": "2.3.1", "contest": "sort-it-out", "functionName": "by_length", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [["pear", "fig", "apple"]], "expected": ["fig", "pear", "apple"]},
    {"args": [["bb", "aa", "c"]], "expected": ["c", "bb", "aa"]},
    {"args": [[]], "expected": []},
    {"args": [["one"]], "expected": ["one"], "hidden": true},
    {"args": [["ccc", "bb", "a"]], "expected": ["a", "bb", "ccc"], "hidden": true},
    {"args": [["to", "be", "or", "not"]], "expected": ["to", "be", "or", "not"], "hidden": true},
    {"args": [["xyz", "ab", "cd", "e"]], "expected": ["e", "ab", "cd", "xyz"], "hidden": true}
  ]
}
--- description
Write a function `by_length(words)` that returns the words sorted so that the **shortest come first**.

Words of the same length must stay in the order they were given. (A sort that does this is called *stable*.)

Write the sort yourself: `sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `by_length(["pear", "fig", "apple"])` | `["fig", "pear", "apple"]` |
| `by_length(["bb", "aa", "c"])` | `["c", "bb", "aa"]` |
--- hints
- Take an insertion sort and compare `len(...)` of the words instead of the words themselves.
- To keep equal-length words in their original order, only move a word left past words that are **strictly longer** than it.
--- starter
def by_length(words):
    # Write your code here
    pass
--- solution
def by_length(words):
    words = list(words)
    for i in range(1, len(words)):
        current = words[i]
        j = i - 1
        while j >= 0 and len(words[j]) > len(current):
            words[j + 1] = words[j]
            j -= 1
        words[j + 1] = current
    return words
