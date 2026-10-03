--- meta
{"title": "Two passes of a selection sort", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Selection sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "check": "run", "options": ["[1, 2, 9, 5, 7]", "[1, 2, 5, 7, 9]", "[1, 9, 2, 5, 7]", "[2, 1, 9, 5, 7]"], "answer": 0}
--- description
```python
items = [9, 2, 1, 5, 7]
for i in range(2):
    smallest = i
    for j in range(i + 1, len(items)):
        if items[j] < items[smallest]:
            smallest = j
    items[i], items[smallest] = items[smallest], items[i]
print(items)
```

What does this program print after two passes of a selection sort?
--- hints
- Pass 1 finds the smallest item in the whole list and swaps it to index 0.
- Pass 2 finds the smallest item from index 1 onwards and swaps it to index 1.
--- explanation
- Pass 1: the smallest of `[9, 2, 1, 5, 7]` is 1, at index 2. Swapping it with index 0 gives `[1, 2, 9, 5, 7]`.
- Pass 2: the smallest from index 1 is 2, already at index 1, so the swap changes nothing.

It prints `[1, 2, 9, 5, 7]`.
