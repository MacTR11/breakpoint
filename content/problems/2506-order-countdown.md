--- meta
{"contest": "lower-sixth-league", "title": "Put in order: countdown", "kind": "CODE", "style": "ORDER", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "basics", "specRef": "2.2.1", "functionName": "countdown_text",
  "tests": [
    {"args": [3], "expected": "3 2 1 Go!"},
    {"args": [1], "expected": "1 Go!"},
    {"args": [0], "expected": "Go!"},
    {"args": [5], "expected": "5 4 3 2 1 Go!", "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `countdown_text(n)` returns the countdown from n to 1 followed by "Go!", with spaces between, such as `"3 2 1 Go!"`.

Each line already has its indentation, so you only need to get the order right.
--- hints
- `range(n, 0, -1)` counts down from n to 1.
- `" ".join(...)` only joins strings, so each number has to go in as `str(i)`.
--- starter
        words.append(i)
    words.append("Go!")
    for i in range(n, 0, -1):
    return " ".join(words)
    words = []
def countdown_text(n):
        words.append(str(i))
--- solution
def countdown_text(n):
    words = []
    for i in range(n, 0, -1):
        words.append(str(i))
    words.append("Go!")
    return " ".join(words)
