--- meta
{"contest": "code-breakers", "title": "Fix: swap the pairs", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Logic errors", "points": 20, "track": "strings", "specRef": "3.3", "functionName": "swap_pairs",
  "tests": [
    {"args": ["abcdef"], "expected": "badcfe"},
    {"args": ["abcde"], "expected": "badce"},
    {"args": ["hi"], "expected": "ih"},
    {"args": ["a"], "expected": "a", "hidden": true},
    {"args": [""], "expected": "", "hidden": true},
    {"args": ["secret message"], "expected": "esrctem seaseg", "hidden": true}
  ]
}
--- description
  `swap_pairs(text)` hides a message by swapping each pair of neighbouring characters: the 1st with the 2nd, the 3rd with the 4th, and so on. A character left over at the end stays where it is. So `swap_pairs("secret")` should be `"esrcte"`.

  There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- Compare `swap_pairs("abcdef")` with what it should be: the two letters in each pair come out in the wrong order.
- With an odd number of characters the loop never reaches the last one. Add it on after the loop if it is there.
--- starter
def swap_pairs(text):
    result = ""
    for i in range(0, len(text) - 1, 2):
        result = result + text[i] + text[i + 1]
    return result
--- solution
def swap_pairs(text):
    result = ""
    for i in range(0, len(text) - 1, 2):
        result = result + text[i + 1] + text[i]
    if len(text) % 2 == 1:
        result = result + text[-1]
    return result
