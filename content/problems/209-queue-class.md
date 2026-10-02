--- meta
{
  "title": "Build a Queue", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Queues", "points": 25, "track": "structures", "specRef": "1.4.2",
  "functionName": "Queue",
  "tests": [
    { "steps": [["Queue", 3], ["enqueue", "A"], ["enqueue", "B"], ["dequeue"], ["size"], ["is_empty"]], "expected": [true, true, "A", 1, false] },
    { "steps": [["Queue", 2], ["dequeue"], ["is_empty"]], "expected": [null, true] },
    { "steps": [["Queue", 2], ["enqueue", 1], ["enqueue", 2], ["enqueue", 3], ["is_full"], ["size"]], "expected": [true, true, false, true, 2] },
    { "steps": [["Queue", 2], ["enqueue", 1], ["enqueue", 2], ["dequeue"], ["enqueue", 3], ["dequeue"], ["dequeue"], ["dequeue"], ["is_empty"]], "expected": [true, true, 1, true, 2, 3, null, true], "hidden": true },
    { "steps": [["Queue", 1], ["enqueue", "x"], ["is_full"], ["dequeue"], ["is_full"], ["enqueue", "y"], ["dequeue"]], "expected": [true, true, "x", false, true, "y"], "hidden": true },
    { "steps": [["Queue", 3], ["size"], ["is_full"], ["enqueue", 0], ["size"]], "expected": [0, false, true, 1], "hidden": true }
  ]
}
--- description
A queue is a **first in, first out** structure: items leave in the order they joined.

Complete the class `Queue`, which has a fixed capacity set when it is created.

| Method | What it does |
| --- | --- |
| `enqueue(item)` | Adds `item` to the back. Returns `True`, or `False` if the queue is full (and adds nothing). |
| `dequeue()` | Removes and returns the item at the front, or returns `None` if the queue is empty. |
| `is_empty()` | Returns `True` if there are no items. |
| `is_full()` | Returns `True` if the queue is at capacity. |
| `size()` | Returns the number of items in the queue. |

### Example

```python
queue = Queue(3)
queue.enqueue("A")   # True
queue.enqueue("B")   # True
queue.dequeue()      # "A"
queue.size()         # 1
```

### Challenge

A Python list makes this easy. For the full exam-style version, store the items in a fixed-size list with `front` and `rear` pointers that wrap around: a **circular queue**.
--- hints
- The simplest working version keeps the items in a Python list: `append` adds to the back and `pop(0)` takes from the front.
- Check `is_full()` at the top of `enqueue` and `is_empty()` at the top of `dequeue`, returning `False` or `None` before changing anything.
--- starter
class Queue:
    def __init__(self, capacity):
        self.capacity = capacity
        # Set up your attributes here

    def enqueue(self, item):
        pass

    def dequeue(self):
        pass

    def is_empty(self):
        pass

    def is_full(self):
        pass

    def size(self):
        pass
--- solution
class Queue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.items = [None] * capacity
        self.front = 0
        self.count = 0

    def enqueue(self, item):
        if self.is_full():
            return False
        rear = (self.front + self.count) % self.capacity
        self.items[rear] = item
        self.count += 1
        return True

    def dequeue(self):
        if self.is_empty():
            return None
        item = self.items[self.front]
        self.front = (self.front + 1) % self.capacity
        self.count -= 1
        return item

    def is_empty(self):
        return self.count == 0

    def is_full(self):
        return self.count == self.capacity

    def size(self):
        return self.count
