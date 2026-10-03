--- meta
{"title": "Changed or not?", "kind": "PUZZLE", "difficulty": "HARD", "topic": "References", "points": 20, "track": "lists", "specRef": "2.2.1", "contest": "grand-final", "check": "run", "options": ["[1, 2, 3]", "[1, 2, 3, 4]", "[0, 5]", "[1, 2, 3, 4, 5]"], "answer": 1}
--- description
```python
def change(items):
    items.append(4)
    items = [0]
    items.append(5)

data = [1, 2, 3]
change(data)
print(data)
```

What does this program print?
--- hints
- When a list is passed to a function, the parameter is another name for the same list.
- `items = [0]` does not change the original list. It makes the name `items` point at a brand-new one.
--- explanation
Inside the function, `items` starts as another name for the same list as `data`, so `items.append(4)` changes the caller's list to `[1, 2, 3, 4]`.

`items = [0]` then makes `items` refer to a **new** list. From that point on, nothing done through `items` touches `data`, so the 5 is appended to a list that is thrown away when the function ends.

The program prints **[1, 2, 3, 4]**.
