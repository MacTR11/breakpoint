--- meta
{"title": "Fix: the queue that jumps", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Queues", "points": 20, "track": "debugging", "specRef": "1.4.2", "contest": "structures-derby", "functionName": "Queue",
  "tests": [
    {"steps": [["Queue"], ["enqueue", "a"], ["enqueue", "b"], ["dequeue"], ["dequeue"]], "expected": [1, 2, "a", "b"]},
    {"steps": [["Queue"], ["peek"], ["dequeue"]], "expected": [null, null]},
    {"steps": [["Queue"], ["enqueue", 1], ["peek"], ["enqueue", 2], ["peek"]], "expected": [1, 1, 2, 1]},
    {"steps": [["Queue"], ["enqueue", 1], ["enqueue", 2], ["enqueue", 3], ["dequeue"], ["peek"], ["dequeue"], ["dequeue"], ["dequeue"]], "expected": [1, 2, 3, 1, 2, 2, 3, null], "hidden": true}
  ]
}
--- description
This `Queue` should be **first in, first out**.

- `enqueue(item)` adds to the back and returns the new size.
- `dequeue()` removes and returns the item at the front, or returns `None` if the queue is empty.
- `peek()` returns the item at the front without removing it, or `None` if the queue is empty.

There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- Items are leaving in the wrong order. `pop()` with no argument removes the **last** item of a list. Which end is the front of this queue?
- `peek` on an empty queue crashes. It needs the same check that `dequeue` already has.
--- starter
class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        self.items.append(item)
        return len(self.items)

    def dequeue(self):
        if len(self.items) == 0:
            return None
        return self.items.pop()

    def peek(self):
        return self.items[0]
--- solution
class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        self.items.append(item)
        return len(self.items)

    def dequeue(self):
        if len(self.items) == 0:
            return None
        return self.items.pop(0)

    def peek(self):
        if len(self.items) == 0:
            return None
        return self.items[0]
