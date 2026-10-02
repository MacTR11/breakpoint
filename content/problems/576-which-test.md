--- meta
{"title": "Which Test Finds It?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Choosing test data", "points": 10, "track": "debugging", "specRef": "3.3", "options": ["[3, 9, 4]", "[0, 5, 2]", "[-3, -7, -1]", "[5]"], "answer": 2}
--- description
This function is meant to return the largest number in a list.

```python
def largest(numbers):
    biggest = 0
    for number in numbers:
        if number > biggest:
            biggest = number
    return biggest
```

It contains a bug, but most tests pass. Which list of test data would **reveal** the bug?
--- hints
- `biggest` starts at 0. When would no number in the list ever beat that?
--- explanation
`biggest` starts at 0, so the function is only right when the largest number is 0 or more.

With **[-3, -7, -1]** no number is greater than 0, so `biggest` never changes and the function returns 0, which is not even in the list. The correct answer is −1.

The other three lists all pass, which is how a bug like this survives. Choosing test data that pokes at the awkward cases is a skill in itself.
