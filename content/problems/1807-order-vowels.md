--- meta
{"title": "Put in order: count the vowels", "kind": "CODE", "style": "ORDER", "difficulty": "EASY", "topic": "String handling", "points": 5, "track": "strings", "specRef": "2.2.1", "functionName": "count_vowels",
  "tests": [
    {"args": ["banana"], "expected": 3},
    {"args": ["SKY"], "expected": 0},
    {"args": [""], "expected": 0},
    {"args": ["Queue"], "expected": 4, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled. Drag them into order (or use the arrow buttons) so that `count_vowels(text)` returns how many letters in `text` are vowels, in either case.

Each line already has its indentation, so you only need to get the order right.
--- hints
- The counter starts at 0, before the loop.
- Converting to lower case happens once, before the letters are checked.
--- starter
    text = text.lower()
    for letter in text:
            count = count + 1
    count = 0
def count_vowels(text):
        if letter in "aeiou":
    return count
--- solution
def count_vowels(text):
    text = text.lower()
    count = 0
    for letter in text:
        if letter in "aeiou":
            count = count + 1
    return count
