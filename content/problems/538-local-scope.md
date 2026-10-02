--- meta
{ "title": "Local or Global?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Scope", "points": 10, "track": "recursion", "specRef": "2.2.1",
  "options": ["5 15", "15 15", "5 5", "An error is raised"], "answer": 0 }
--- description
```python
total = 5

def add_ten(n):
    total = n + 10
    return total

result = add_ten(total)
print(total, result)
```

What does this Python program print?
--- hints
- Assigning to a name inside a function creates a new local variable, unless the function says `global`.
- The function's `total` and the program's `total` are two different variables.
--- explanation
Assigning to `total` inside the function creates a new **local** variable that exists only while the function runs. It has the same name as the global `total` but is a separate variable.

The function returns 15, which is stored in `result`. The global `total` was never changed, so the program prints **5 15**.

To change the global from inside the function you would need the line `global total`, although returning a value, as this code does, is the better design.
