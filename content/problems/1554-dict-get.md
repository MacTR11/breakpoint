--- meta
{"title": "Getting from a dictionary", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Dictionaries", "points": 5, "track": "lists", "specRef": "2.2.1", "check": "run", "options": ["4", "5", "3", "KeyError"], "answer": 0}
--- description
```python
stock = {"pen": 3, "ink": 0}
print(stock.get("pen", 1) + stock.get("pad", 1) + stock.get("ink", 1))
```

What does this program print?
--- hints
- `.get(key, default)` gives the value for the key if it is there, and the default if it is not.
- `"ink"` is in the dictionary, even though its value is 0.
--- explanation
- `stock.get("pen", 1)` is 3: the key is there.
- `stock.get("pad", 1)` is 1: there is no `"pad"`, so the default is used, and no error is raised.
- `stock.get("ink", 1)` is 0: the key is there, so its value is used, even though it is 0.

3 + 1 + 0 is 4.
