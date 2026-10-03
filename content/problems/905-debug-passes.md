--- meta
{ "title": "Off by one", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Debugging", "points": 10, "track": "debugging", "specRef": "3.3", "contest": "build-it-right",
  "options": ["Line 2", "Line 3", "Line 4", "Line 5"], "answer": 2 }
--- description
This function should count how many marks are passes. A mark **equal to** the pass mark counts as a pass.

```python
1  def count_passes(marks, pass_mark):
2      passes = 0
3      for mark in marks:
4          if mark > pass_mark:
5              passes = passes + 1
6      return passes
```

A test calls `count_passes([40, 55, 39], 40)`. The expected result is `2` but the actual result is `1`.

Which line contains the error?
--- hints
- Which mark in the test data is being treated wrongly? What is special about it?
--- explanation
**Line 4** uses `>` where it needs `>=`. A mark of exactly 40 is not greater than 40, so it is not counted.

This kind of mistake only shows up with **boundary** test data, a mark exactly on the pass mark, which is why boundary values belong in every test plan.
