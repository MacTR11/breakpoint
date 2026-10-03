--- meta
{"title": "One indent too many", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Indentation", "points": 5, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["6", "1 3 6", "1 2 3", "0 1 3"], "answer": 1}
--- description
A student wants to add up three numbers and print the total **once**.

```python
total = 0
for n in [1, 2, 3]:
    total = total + n
    print(total)
```

What does the program actually print? (Each number appears on its own line.)
--- hints
- The `print` is indented, so it belongs to the loop.
--- explanation
Because `print(total)` is indented under the `for`, it runs every time round the loop, showing the running total: **1**, then **3**, then **6**.

Moving the `print` back to the left margin takes it out of the loop, so it runs once at the end and prints just 6. In Python, indentation is not decoration: it decides what belongs to what.
