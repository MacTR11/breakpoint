--- meta
{"title": "Dictionary updates", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Dictionaries", "points": 5, "track": "lists", "specRef": "2.2.1", "check": "run", "options": ["2 2", "3 2", "3 3", "2 3"], "answer": 1}
--- description
```python
stock = {"pen": 3, "ink": 1}
stock["pen"] = stock["pen"] - 1
stock["pad"] = 4
print(len(stock), stock["pen"])
```

What does this program print?
--- hints
- Assigning to a key that already exists changes its value. Assigning to a new key adds it.
--- explanation
`"pen"` already exists, so the second line changes its value from 3 to 2.

`"pad"` is a new key, so the third line adds it, making three keys in all.

The program prints **3 2**.
