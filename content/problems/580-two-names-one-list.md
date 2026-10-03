--- meta
{"title": "Two names, one list", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Aliasing", "points": 10, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["3", "4", "7", "An error"], "answer": 1}
--- description
```python
a = [1, 2, 3]
b = a
b.append(4)
print(len(a))
```

What does this program print?
--- hints
- Does `b = a` make a second list, or a second name for the same list?
--- explanation
`b = a` does not copy the list. It makes `b` another name for the **same** list, so appending through `b` changes what `a` sees as well. The list now has **4** items.

To get a separate copy, use `b = list(a)` or `b = a[:]`. This matters whenever a function changes a list it was given: the caller's list changes too.
