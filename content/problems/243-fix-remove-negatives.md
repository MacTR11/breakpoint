--- meta
{"title": "Fix: the vanishing check", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Changing a list while looping", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "remove_negatives",
  "tests": [
    {"args": [[1, -2, 3]], "expected": [1, 3]},
    {"args": [[-1, -2, 3]], "expected": [3]},
    {"args": [[4, 5]], "expected": [4, 5]},
    {"args": [[-1, -2, -3, -4]], "expected": [], "hidden": true},
    {"args": [[]], "expected": [], "hidden": true},
    {"args": [[0]], "expected": [0], "hidden": true},
    {"args": [[5, -1, -1, 6]], "expected": [5, 6], "hidden": true}
  ]
}
--- description
`remove_negatives(numbers)` should return the list with every negative number taken out, keeping the rest in order.

It works on some lists and quietly gives the wrong answer on others.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Compare the two examples with negative numbers. It only goes wrong when two negatives are next to each other.
- Removing an item from a list while a `for` loop is walking along it makes the loop skip the next item. Build a **new** list of the numbers to keep instead.
--- starter
def remove_negatives(numbers):
    for number in numbers:
        if number < 0:
            numbers.remove(number)
    return numbers
--- solution
def remove_negatives(numbers):
    kept = []
    for number in numbers:
        if number >= 0:
            kept.append(number)
    return kept
