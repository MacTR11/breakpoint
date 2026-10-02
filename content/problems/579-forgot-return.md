--- meta
{"title": "The Function That Says Nothing", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Missing return", "points": 5, "track": "debugging", "specRef": "3.3", "check": "run", "options": ["8", "4", "None", "Nothing at all"], "answer": 2}
--- description
```python
def double(n):
    result = n * 2

print(double(4))
```

What does this program print?
--- hints
- The function works out the answer. What does it do with it?
--- explanation
The function calculates 8 and stores it in `result`, but it never **returns** it. A Python function with no `return` statement gives back the special value `None`, so that is what gets printed.

The fix is one more line inside the function: `return result`.
