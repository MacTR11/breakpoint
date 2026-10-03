--- meta
{"title": "Trace: building a string backwards", "kind": "PUZZLE", "style": "TRACE", "difficulty": "EASY", "topic": "Trace tables", "points": 10, "track": "strings", "specRef": "2.2.1", "options": {"columns": ["ch", "result", "output"], "rows": [["", "", ""], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "", ""], ["t", "t", "t"], ["r", "rt", "rt"], ["a", "art", "art"], ["m", "mart", "mart"]]}
--- description
```python
word = "tram"
result = ""
for ch in word:
    result = ch + result
    print(result)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, including what it prints. Write text without quote marks. Write a value in every box, even if it has not changed.
--- hints
- Each letter is added to the **front** of `result`, not the end.
- The first row has no `ch` yet, and `result` is empty.
--- explanation
Each letter goes on the front: `t`, then `rt`, then `art`, then `mart`. Adding to the front reverses the word.
