--- meta
{"title": "Priority Queue", "kind": "CODE", "difficulty": "HARD", "topic": "Queues", "points": 40, "track": "structures", "specRef": "1.4.2", "contest": "structures-derby", "functionName": "PriorityQueue",
  "tests": [
    {"steps": [["PriorityQueue"], ["enqueue", "low", 5], ["enqueue", "high", 1], ["dequeue"], ["dequeue"], ["dequeue"]], "expected": [1, 2, "high", "low", null]},
    {"steps": [["PriorityQueue"], ["enqueue", "a", 2], ["enqueue", "b", 2], ["enqueue", "c", 1], ["dequeue"], ["dequeue"], ["dequeue"]], "expected": [1, 2, 3, "c", "a", "b"]},
    {"steps": [["PriorityQueue"], ["size"], ["dequeue"]], "expected": [0, null], "hidden": true},
    {"steps": [["PriorityQueue"], ["enqueue", "x", 3], ["enqueue", "y", 1], ["dequeue"], ["enqueue", "z", 2], ["size"], ["dequeue"], ["dequeue"]], "expected": [1, 2, "y", 2, 2, "z", "x"], "hidden": true},
    {"steps": [["PriorityQueue"], ["enqueue", 1, 0], ["enqueue", 2, 0], ["enqueue", 3, 0], ["dequeue"], ["dequeue"], ["dequeue"]], "expected": [1, 2, 3, 1, 2, 3], "hidden": true}
  ]
}
--- description
In a priority queue, items do not simply leave in the order they arrived: the most urgent goes first.

Write a class `PriorityQueue`, which starts empty.

| Method | What it does |
| --- | --- |
| `enqueue(item, priority)` | Adds `item` with a whole-number `priority`. Returns the new number of items. |
| `dequeue()` | Removes and returns the item with the **lowest** priority number. If several share it, the one that has waited longest goes first. Returns `None` if the queue is empty. |
| `size()` | Returns the number of items. |

### Example

```python
queue = PriorityQueue()
queue.enqueue("low", 5)    # 1
queue.enqueue("high", 1)   # 2
queue.dequeue()            # "high"
queue.dequeue()            # "low"
```
--- hints
- Store each entry as a pair, such as `[priority, item]`, in a list kept in arrival order.
- To dequeue, find the **first** entry with the smallest priority (use `<`, not `<=`, as you scan, so that earlier arrivals win ties), remove it and return its item.
--- starter
class PriorityQueue:
    def __init__(self):
        # Decide what to store here
        pass

    def enqueue(self, item, priority):
        pass

    def dequeue(self):
        pass

    def size(self):
        pass
--- solution
class PriorityQueue:
    def __init__(self):
        self.entries = []

    def enqueue(self, item, priority):
        self.entries.append([priority, item])
        return len(self.entries)

    def dequeue(self):
        if len(self.entries) == 0:
            return None
        best = 0
        for i in range(1, len(self.entries)):
            if self.entries[i][0] < self.entries[best][0]:
                best = i
        return self.entries.pop(best)[1]

    def size(self):
        return len(self.entries)
