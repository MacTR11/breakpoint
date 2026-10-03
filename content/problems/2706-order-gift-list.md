--- meta
{"contest": "winter-cracker", "title": "Put in order: the gift list", "kind": "CODE", "style": "ORDER", "difficulty": "MEDIUM", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "gift_list",
  "tests": [
    {"args": [["socks", "book", "jumper"]], "expected": ["1. book", "2. jumper", "3. socks"]},
    {"args": [[]], "expected": []},
    {"args": [["scarf"]], "expected": ["1. scarf"]},
    {"args": [["yo-yo", "kite", "game", "apple"]], "expected": ["1. apple", "2. game", "3. kite", "4. yo-yo"], "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `gift_list(presents)` returns the presents in alphabetical order, each numbered from 1, such as `["1. book", "2. jumper", "3. socks"]`.

Each line already has its indentation, so you only need to get the order right.
--- hints
- `sorted(presents)` gives a new list in alphabetical order.
- The number starts at 1 and goes up after each present is added.
--- starter
def gift_list(presents):
        number = number + 1
    for present in presents:
        lines.append(str(number) + ". " + present)
    number = 1
    for present in sorted(presents):
    return lines
    lines = []
--- solution
def gift_list(presents):
    lines = []
    number = 1
    for present in sorted(presents):
        lines.append(str(number) + ". " + present)
        number = number + 1
    return lines
