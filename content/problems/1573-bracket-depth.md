--- meta
{"title": "How deep do the brackets go?", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Stacks", "points": 25, "track": "structures", "specRef": "1.4.2", "functionName": "bracket_depth",
  "tests": [
    {"args": ["(a(b)c)"], "expected": 2},
    {"args": ["((()))()"], "expected": 3},
    {"args": ["no brackets"], "expected": 0},
    {"args": ["(()"], "expected": -1, "hidden": true},
    {"args": ["())("], "expected": -1, "hidden": true},
    {"args": [""], "expected": 0, "hidden": true},
    {"args": ["(x)(y)(z)"], "expected": 1, "hidden": true}
  ]
}
--- description
Write the function `bracket_depth(text)`, which returns how deeply the round brackets in `text` are nested at their deepest point. If the brackets do not match up properly, it returns `-1`.

| `text` | returns |
| --- | --- |
| `"(a(b)c)"` | `2` |
| `"((()))()"` | `3` |
| `"no brackets"` | `0` |
| `"(()"` | `-1` |
| `"())("` | `-1` |
--- hints
- You do not need a whole stack, only its height: add 1 for `(` and take 1 for `)`, and remember the biggest height reached.
- The brackets are unmatched if the height ever goes below 0, or is not 0 at the end.
--- starter
def bracket_depth(text):
    pass
--- solution
def bracket_depth(text):
    depth = 0
    deepest = 0
    for ch in text:
        if ch == "(":
            depth = depth + 1
            deepest = max(deepest, depth)
        elif ch == ")":
            depth = depth - 1
            if depth < 0:
                return -1
    if depth != 0:
        return -1
    return deepest
