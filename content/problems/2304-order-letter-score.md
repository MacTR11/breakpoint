--- meta
{"contest": "code-breakers", "title": "Put in order: letter score", "kind": "CODE", "style": "ORDER", "difficulty": "EASY", "topic": "String handling", "points": 5, "track": "strings", "specRef": "1.4.1", "functionName": "letter_score",
  "tests": [
    {"args": ["abc"], "expected": 6},
    {"args": ["Zebra"], "expected": 52},
    {"args": ["hi there"], "expected": 73},
    {"args": [""], "expected": 0, "hidden": true},
    {"args": ["CAB"], "expected": 6, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `letter_score(word)` adds up the letters' places in the alphabet (a is 1, b is 2, … z is 26), in either case, ignoring anything that is not a letter.

Each line already has its indentation, so you only need to get the order right.
--- hints
- The total starts at 0 before the loop, and is returned after it.
- a is 1, but `ord("a") - ord("a")` is 0. The spare line forgets to add 1.
--- starter
def letter_score(word):
    total = 0
    return total
            total = total + ord(ch) - ord("a") + 1
            total = total + ord(ch) - ord("a")
    for ch in word.lower():
        if ch.isalpha():
--- solution
def letter_score(word):
    total = 0
    for ch in word.lower():
        if ch.isalpha():
            total = total + ord(ch) - ord("a") + 1
    return total
