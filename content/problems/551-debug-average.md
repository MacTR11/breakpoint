--- meta
{ "title": "Find the bug", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Debugging", "points": 10, "track": "debugging", "specRef": "3.3",
  "options": ["Line 2", "Line 3", "Line 4", "Line 5"], "answer": 2 }
--- description
This function should return the mean of a list of marks.

```python
1  def average(marks):
2      total = 0
3      for mark in marks:
4          total = mark
5      return total / len(marks)
```

A test calls `average([4, 6, 8])`. The expected result is `6.0` but the actual result is `2.666…`

Which line contains the error?
--- hints
- Trace `total` through the loop for `[4, 6, 8]`. What is it after each mark?
--- explanation
**Line 4** replaces `total` with each mark instead of adding to it. After the loop `total` is just the last mark, 8, and 8 ÷ 3 is 2.666…

It should read `total = total + mark`.

This is a *logic error*: the program runs without crashing but gives the wrong answer. Comparing expected results with actual results in a test table is how such errors are found.
