--- meta
{"contest": "upper-sixth-challenge", "title": "Trace: a breadth-first search", "kind": "PUZZLE", "style": "TRACE", "difficulty": "HARD", "topic": "Trace tables", "points": 25, "track": "algorithms", "specRef": "2.3.1", "options": {"columns": ["node", "queue", "visited"], "rows": [["", "['A']", "['A']"], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "['A']", "['A']"], ["A", "['B', 'C']", "['A', 'B', 'C']"], ["B", "['C', 'D']", "['A', 'B', 'C', 'D']"], ["C", "['D', 'E']", "['A', 'B', 'C', 'D', 'E']"], ["D", "['E', 'F']", "['A', 'B', 'C', 'D', 'E', 'F']"], ["E", "['F']", "['A', 'B', 'C', 'D', 'E', 'F']"], ["F", "[]", "['A', 'B', 'C', 'D', 'E', 'F']"]]}
--- description
```python
graph = {"A": ["B", "C"], "B": ["D"], "C": ["D", "E"], "D": ["F"], "E": ["F"], "F": []}
queue = ["A"]
visited = ["A"]
while len(queue) > 0:
    node = queue.pop(0)
    for neighbour in graph[node]:
        if neighbour not in visited:
            visited.append(neighbour)
            queue.append(neighbour)
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop (the `while` loop). Write lists as Python would print them, such as `['A', 'B']`. Write a value in every box, even if it has not changed.
--- hints
- `queue.pop(0)` takes the node at the front of the queue. Its neighbours that have not been seen go on the back.
- A node is added to `visited` when it joins the queue, so it is never queued twice.
--- explanation
- A: B and C are new, so the queue is `['B', 'C']`.
- B: D is new: `['C', 'D']`.
- C: D has been seen, E is new: `['D', 'E']`.
- D: F is new: `['E', 'F']`.
- E: F has been seen: `['F']`.
- F: no neighbours, and the queue is empty.

The nodes are visited in order of how many steps they are from A: A; then B and C; then D and E; then F.
