--- meta
{"title": "Division, three ways", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Arithmetic", "points": 10, "track": "basics", "specRef": "2.2.1", "check": "run", "options": ["3.5 3 -4", "3.5 3 -3", "3 3 -4", "3.5 4 -3"], "answer": 0}
--- description
```python
print(7 / 2, 7 // 2, -7 // 2)
```

What does this program print?
--- hints
- `/` always gives a decimal answer.
- `//` rounds **down**, towards minus infinity, not towards zero.
--- explanation
`7 / 2` is `3.5`. `7 // 2` is 3. `-7 // 2` is −3.5 rounded **down**, which is −4, not −3. So it prints `3.5 3 -4`. Python's `//` always rounds down, which surprises people with negative numbers.
