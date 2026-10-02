--- meta
{"title": "The Missing Name", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Off-by-one error", "points": 10, "track": "debugging", "specRef": "3.3", "options": ["Change `range(1, len(names))` to `range(len(names))`", "Change `range(1, len(names))` to `range(1, len(names) + 1)`", "Change `names[i]` to `names[i + 1]`", "Change `print` to `return`"], "answer": 0}
--- description
This program should print all three names, but `Ada` never appears.

```python
names = ["Ada", "Bo", "Cy"]
for i in range(1, len(names)):
    print(names[i])
```

Which change fixes it?
--- hints
- What is the index of the first item in a list?
- Write down the values `i` takes with the loop as it is now.
--- explanation
List indexes start at **0**, but `range(1, len(names))` produces 1 and 2, so `names[0]` is skipped.

`range(len(names))` produces 0, 1 and 2, which covers every item.

The second option would go one past the end of the list and crash with an `IndexError`; so would the third.
