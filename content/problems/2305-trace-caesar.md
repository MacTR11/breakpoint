--- meta
{"contest": "code-breakers", "title": "Trace: a Caesar shift", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "strings", "specRef": "1.4.1", "options": {"columns": ["ch", "code", "result"], "rows": [["", "", ""], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "", ""], ["Z", "2", "C"], ["A", "3", "CD"], ["P", "18", "CDS"]]}
--- description
```python
word = "ZAP"
result = ""
for ch in word:
    code = ord(ch) - ord("A")
    code = (code + 3) % 26
    result = result + chr(code + ord("A"))
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop. Write text without quote marks. Write a value in every box, even if it has not changed.
--- hints
- `ord("A")` is 65, so `ord(ch) - ord("A")` is the letter's place: A is 0 and Z is 25.
- `% 26` wraps a place past Z back round to the start of the alphabet.
--- explanation
- Z is place 25. 25 + 3 is 28, and 28 % 26 is 2, which is C.
- A is place 0, and 0 + 3 is 3: D.
- P is place 15, and 15 + 3 is 18: S.

So `ZAP` becomes `CDS`. The `% 26` is what lets letters near the end wrap round to the start.
