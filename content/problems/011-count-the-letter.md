--- meta
{"title": "Count the letter", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "count_letter", "banned": [".count("],
  "tests": [
    {"args": ["banana", "a"], "expected": 3},
    {"args": ["tower", "z"], "expected": 0},
    {"args": ["", "a"], "expected": 0},
    {"args": ["aaa", "a"], "expected": 3, "hidden": true},
    {"args": ["Mississippi", "s"], "expected": 4, "hidden": true},
    {"args": ["Hello", "l"], "expected": 2, "hidden": true}
  ]
}
--- description
`count_letter(text, letter)` should return how many times `letter` appears in `text`.

Write the loop yourself rather than using the `count` method.

For example, `count_letter("banana", "a")` returns `3`.
--- hints
- `for ch in text:` gives you one character at a time.
- Start a counter at 0 and add 1 whenever `ch == letter`.
--- starter
def count_letter(text, letter):
    count = 0
    return count
--- solution
def count_letter(text, letter):
    count = 0
    for ch in text:
        if ch == letter:
            count = count + 1
    return count
