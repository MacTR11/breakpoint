--- meta
{"contest": "lower-sixth-league", "title": "What does it print: slices", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "check": "run", "options": ["Thu ['Tue', 'Wed'] 3", "Fri ['Tue', 'Wed', 'Thu'] 3", "Thu ['Tue', 'Wed', 'Thu'] 2", "Wed ['Mon', 'Tue'] 3"], "answer": 0}
--- description
What does this program print?

```python
days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
print(days[-2], days[1:3], len(days[::2]))
```
--- hints
- Negative indexes count from the end: `days[-1]` is the last item.
- A slice `[a:b]` stops **before** index b. `[::2]` takes every second item, starting with the first.
--- explanation
- `days[-2]` is the second from the end: `Thu`.
- `days[1:3]` is indexes 1 and 2 (it stops before 3): `['Tue', 'Wed']`.
- `days[::2]` is `['Mon', 'Wed', 'Fri']`, which has 3 items.
