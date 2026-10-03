--- meta
{"title": "Every arrangement", "kind": "CODE", "difficulty": "HARD", "topic": "Recursion", "points": 50, "track": "recursion", "specRef": "2.2.1", "contest": "recursion-rumble", "functionName": "arrangements", "banned": ["import"],
  "tests": [
    {"args": ["ab"], "expected": ["ab", "ba"]},
    {"args": ["a"], "expected": ["a"]},
    {"args": ["abc"], "expected": ["abc", "acb", "bac", "bca", "cab", "cba"]},
    {"args": [""], "expected": [""], "hidden": true},
    {"args": ["ba"], "expected": ["ab", "ba"], "hidden": true},
    {"args": ["dog"], "expected": ["dgo", "dog", "gdo", "god", "odg", "ogd"], "hidden": true}
  ]
}
--- description
Write a function `arrangements(text)` that returns a list of **every possible ordering** of the characters in `text`, sorted into alphabetical order.

All the characters in `text` are different. The empty string has exactly one arrangement: itself.

Importing a library to do this is not allowed, but `sorted()` is fine.

### Examples

| Call | Returns |
| --- | --- |
| `arrangements("ab")` | `["ab", "ba"]` |
| `arrangements("abc")` | `["abc", "acb", "bac", "bca", "cab", "cba"]` |
--- hints
- Think recursively: every arrangement of `"abc"` is one of its characters followed by an arrangement of the other two.
- Loop over each index `i`. Take `text[i]` as the first character, build the rest as `text[:i] + text[i + 1:]`, and put that character in front of every arrangement of the rest.
--- starter
def arrangements(text):
    # Write your code here
    pass
--- solution
def arrangements(text):
    if len(text) <= 1:
        return [text]
    result = []
    for i in range(len(text)):
        rest = text[:i] + text[i + 1:]
        for arrangement in arrangements(rest):
            result.append(text[i] + arrangement)
    return sorted(result)
