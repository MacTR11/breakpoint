--- meta
{"title": "Front of the line", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Queues", "points": 5, "track": "structures", "specRef": "1.4.2", "check": "run", "options": ["7 3", "4 3", "7 2", "9 3"], "answer": 0}
--- description
```python
queue = []
for n in [4, 7, 1]:
    queue.append(n)
queue.pop(0)
queue.append(9)
print(queue[0], len(queue))
```

What does this program print?
--- hints
- `append` adds to the back. `pop(0)` removes from the front.
- Write the list out after each line.
--- explanation
After the loop the queue is `[4, 7, 1]`. `pop(0)` removes 4 from the front, leaving `[7, 1]`, and appending 9 gives `[7, 1, 9]`. The front is 7 and there are 3 items: `7 3`.
