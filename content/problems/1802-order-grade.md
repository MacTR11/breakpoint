--- meta
{"title": "Put in order: grade boundaries", "kind": "CODE", "style": "ORDER", "difficulty": "EASY", "topic": "Selection", "points": 5, "track": "basics", "specRef": "2.2.1", "functionName": "grade",
  "tests": [
    {"args": [85], "expected": "A"},
    {"args": [70], "expected": "B"},
    {"args": [55], "expected": "C"},
    {"args": [30], "expected": "U", "hidden": true},
    {"args": [100], "expected": "A", "hidden": true},
    {"args": [60], "expected": "B", "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled. Drag them into order (or use the arrow buttons) so that `grade(mark)` returns `"A"` for 80 or more, `"B"` for 60 or more, `"C"` for 40 or more and `"U"` otherwise.

Each line already has its indentation, so you only need to get the order right.
--- hints
- The tests go from the highest boundary down: once a mark has matched one, the later ones are not looked at.
- `else` always comes last.
--- starter
def grade(mark):
        return "A"
    elif mark >= 40:
    if mark >= 80:
        return "B"
        return "U"
    elif mark >= 60:
    else:
        return "C"
--- solution
def grade(mark):
    if mark >= 80:
        return "A"
    elif mark >= 60:
        return "B"
    elif mark >= 40:
        return "C"
    else:
        return "U"
