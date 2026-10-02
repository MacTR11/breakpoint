--- meta
{
  "title": "Longest Stretch Without Repeats",
  "kind": "CODE",
  "difficulty": "HARD",
  "topic": "Algorithms",
  "points": 40,
  "track": "strings", "specRef": "2.3.1",
  "functionName": "longest_unique",
  "tests": [
    { "args": ["abcabcbb"], "expected": 3 },
    { "args": ["bbbbb"], "expected": 1 },
    { "args": ["pwwkew"], "expected": 3 },
    { "args": [""], "expected": 0, "hidden": true },
    { "args": ["abcdef"], "expected": 6, "hidden": true },
    { "args": ["abba"], "expected": 2, "hidden": true },
    { "args": ["dvdf"], "expected": 3, "hidden": true },
    { "args": ["tmmzuxt"], "expected": 5, "hidden": true },
    { "args": [" "], "expected": 1, "hidden": true }
  ]
}
--- description
Write a function `longest_unique(text)` that returns the **length** of the longest run of consecutive characters in `text` that contains no repeated character.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `longest_unique("abcabcbb")` | `3` | `"abc"` |
| `longest_unique("bbbbb")` | `1` | `"b"` |
| `longest_unique("pwwkew")` | `3` | `"wke"` |

The characters must be next to each other: in `"pwwkew"`, `"pwke"` does not count.

### Challenge

Checking every possible substring works for short strings. A *sliding window* solves it in a single pass.
--- hints
- The slow way works: for every start position, extend to the right until you meet a character already in the current stretch.
- The fast way keeps a window with a `start` position and a dictionary of where each character was last seen. When a character repeats inside the window, move `start` to just after its previous position.
--- starter
def longest_unique(text):
    # Write your code here
    pass
--- solution
def longest_unique(text):
    last_seen = {}
    start = 0
    best = 0
    for i, c in enumerate(text):
        if c in last_seen and last_seen[c] >= start:
            start = last_seen[c] + 1
        last_seen[c] = i
        best = max(best, i - start + 1)
    return best
