--- meta
{"title": "Fix: Recursive Palindrome", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Recursion error", "points": 20, "track": "debugging", "specRef": "3.3", "contest": "recursion-rumble", "functionName": "is_palindrome",
  "tests": [
    {"args": ["racecar"], "expected": true},
    {"args": ["abca"], "expected": false},
    {"args": [""], "expected": true},
    {"args": ["a"], "expected": true, "hidden": true},
    {"args": ["ab"], "expected": false, "hidden": true},
    {"args": ["noon"], "expected": true, "hidden": true},
    {"args": ["abcda"], "expected": false, "hidden": true}
  ]
}
--- description
`is_palindrome(text)` should return `True` if `text` reads the same forwards and backwards.

The idea is right: compare the first and last characters, then check what is in between. But it says `False` for `"racecar"`.

Fix the code in the editor so that every test passes.
--- hints
- After checking that the first and last characters match, what should be left to check? Trace `"racecar"` one call at a time.
- `text[1:]` removes only the first character. To remove the first **and** the last, the slice is `text[1:-1]`.
--- starter
def is_palindrome(text):
    if len(text) == 0:
        return True
    if text[0] != text[-1]:
        return False
    return is_palindrome(text[1:])
--- solution
def is_palindrome(text):
    if len(text) == 0:
        return True
    if text[0] != text[-1]:
        return False
    return is_palindrome(text[1:-1])
