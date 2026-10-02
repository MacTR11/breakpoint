--- meta
{ "title": "Big O: Nested Loops", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Complexity", "points": 10, "track": "algorithms", "specRef": "2.3.1",
  "options": ["O(n)", "O(log n)", "O(n²)", "O(2ⁿ)"], "answer": 2 }
--- description
```
for i = 0 to n - 1
    for j = 0 to n - 1
        print(i * j)
    next j
next i
```

What is the time complexity of this algorithm?
--- hints
- How many times does the `print` run when `n` is 10? When `n` is 20?
--- explanation
The inner loop runs `n` times for **each** of the `n` runs of the outer loop, so the `print` executes n × n times.

That is **O(n²)**, polynomial (quadratic) time. Doubling `n` makes the algorithm take four times as long. Bubble sort and insertion sort have this complexity for the same reason: a loop inside a loop.
