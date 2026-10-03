--- meta
{"title": "List methods", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "check": "run", "options": ["[3, 9, 1, 2]", "[9, 3, 1, 2]", "[3, 9, 1, 2, 5]", "[3, 1, 9, 2]"], "answer": 0}
--- description
```python
items = [3, 1, 2]
items.append(5)
items.insert(1, 9)
items.pop()
print(items)
```

What does this program print?
--- hints
- `append` adds to the end. `insert(1, 9)` puts 9 at index 1 and shifts the rest along.
- `pop()` with no argument removes the **last** item.
--- explanation
Follow the list one line at a time:

- start: `[3, 1, 2]`
- `append(5)`: `[3, 1, 2, 5]`
- `insert(1, 9)`: `[3, 9, 1, 2, 5]`
- `pop()` removes the last item: **`[3, 9, 1, 2]`**
