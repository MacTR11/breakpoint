--- meta
{"title": "Say it again", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "repeat", "banned": ["*"],
  "tests": [
    {"args": ["ha", 3], "expected": "hahaha"},
    {"args": ["go", 1], "expected": "go"},
    {"args": ["la", 0], "expected": ""},
    {"args": ["!", 5], "expected": "!!!!!", "hidden": true}
  ]
}
--- description
`repeat(word, times)` should return the word written out `times` times with no spaces.

For example, `repeat("ha", 3)` returns `"hahaha"`, and `repeat("la", 0)` returns `""`.

Use a loop rather than `*`.
--- hints
- Start with an empty string, `result = ""`.
- `for i in range(times):` repeats the line inside `times` times. Add the word on each time.
--- starter
def repeat(word, times):
    result = ""
    return result
--- solution
def repeat(word, times):
    result = ""
    for i in range(times):
        result = result + word
    return result
