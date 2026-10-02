--- meta
{"title": "Which Line?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Indentation error", "points": 10, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "options": ["Line 2", "Line 4", "Line 5", "Line 6"], "answer": 3}
--- description
This function should count how many numbers in a list are even.

```python
1  def count_evens(numbers):
2      count = 0
3      for number in numbers:
4          if number % 2 == 0:
5              count = count + 1
6          return count
```

`count_evens([2, 4, 5, 6])` returns `1`, but it should return `3`.

Which line contains the error?
--- hints
- How many times does the loop go round before the function returns?
--- explanation
**Line 6** is indented one level too far, which puts the `return` inside the `for` loop. The function returns at the end of the very first time round, after looking at only one number.

Moving `return count` back to line up with `for` makes it run once, after the loop has finished.
