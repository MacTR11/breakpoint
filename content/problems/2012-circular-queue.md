--- meta
{"title": "Queue in an array (b): a circular queue", "kind": "CODE", "difficulty": "HARD", "topic": "Queues", "points": 45, "track": "exam", "specRef": "1.4.2", "functionName": "CircularQueue", "banned": [".append(", ".insert(", ".pop("],
  "tests": [
    {"steps": [["CircularQueue", 3], ["is_empty"], ["enqueue", "a"], ["enqueue", "b"], ["dequeue"], ["enqueue", "c"], ["enqueue", "d"], ["enqueue", "e"], ["dequeue"], ["dequeue"], ["dequeue"], ["dequeue"]], "expected": [true, true, true, "a", true, true, false, "b", "c", "d", null]},
    {"steps": [["CircularQueue", 2], ["enqueue", 1], ["enqueue", 2], ["is_full"], ["enqueue", 3], ["dequeue"], ["is_full"], ["enqueue", 3], ["dequeue"], ["dequeue"], ["is_empty"]], "expected": [true, true, true, false, 1, false, true, 2, 3, true]},
    {"steps": [["CircularQueue", 1], ["dequeue"], ["enqueue", 9], ["enqueue", 8], ["dequeue"], ["enqueue", 7], ["dequeue"], ["is_empty"]], "expected": [null, true, false, 9, true, 7, true], "hidden": true},
    {"steps": [["CircularQueue", 4], ["enqueue", 1], ["enqueue", 2], ["enqueue", 3], ["dequeue"], ["dequeue"], ["enqueue", 4], ["enqueue", 5], ["enqueue", 6], ["enqueue", 7], ["length"], ["dequeue"], ["dequeue"], ["dequeue"], ["dequeue"], ["length"]], "expected": [true, true, true, 1, 2, true, true, true, false, 4, 3, 4, 5, 6, 0], "hidden": true},
    {"steps": [["CircularQueue", 3], ["length"], ["enqueue", 0], ["length"], ["dequeue"], ["dequeue"], ["length"], ["enqueue", 5], ["enqueue", 6], ["enqueue", 7], ["length"], ["is_full"]], "expected": [0, true, 1, 0, null, 0, true, true, true, 3, true], "hidden": true}
  ]
}
--- description
A queue is stored in a one-dimensional array of fixed size. `head` is the index of the item at the front. When items have been removed from the front, the space they used is reused: the queue wraps round from the last element of the array to the first. This is a circular queue.

Write the class `CircularQueue` with:

- a constructor `CircularQueue(size)` that creates an array with room for `size` items
- `is_empty()` and `is_full()`, which each return `True` or `False`
- `length()`, which returns how many items are in the queue
- `enqueue(item)`, which adds the item at the back and returns `True`, or returns `False` without changing anything if the queue is full
- `dequeue()`, which removes and returns the item at the front, or returns `None` if the queue is empty.

Use the array and pointers: do not use `append`, `insert`, or call `pop` on a list.

**[9 marks]**
--- hints
- Keep three attributes besides the array: `head` (index of the front item), `count` (how many items there are) and `size`. Empty and full are then just `count == 0` and `count == size`.
- The next free slot at the back is `(head + count) MOD size`. In Python `MOD` is `%`.
- To dequeue: remember the item at `head`, move `head` on with `(head + 1) % size`, take 1 off `count`, and return the item.
--- starter
class CircularQueue:
    def __init__(self, size):
        pass
--- solution
class CircularQueue:
    def __init__(self, size):
        self.items = [None] * size
        self.size = size
        self.head = 0
        self.count = 0

    def is_empty(self):
        return self.count == 0

    def is_full(self):
        return self.count == self.size

    def length(self):
        return self.count

    def enqueue(self, item):
        if self.is_full():
            return False
        tail = (self.head + self.count) % self.size
        self.items[tail] = item
        self.count = self.count + 1
        return True

    def dequeue(self):
        if self.is_empty():
            return None
        item = self.items[self.head]
        self.head = (self.head + 1) % self.size
        self.count = self.count - 1
        return item
--- explanation
One mark each, up to 9:

- The constructor creates the array and sets the front pointer and item count (or a rear pointer) to starting values.
- `is_empty` is correct.
- `is_full` is correct, and is not fooled when the queue has wrapped round.
- `enqueue` returns `False` when full, without storing anything.
- `enqueue` works out the next free position at the back.
- That position wraps round to index 0 using `MOD size`.
- `dequeue` returns `None` when empty.
- `dequeue` returns the item at the front and moves the front pointer on, wrapping with `MOD size`.
- The count of items (or the rear pointer) is kept up to date in both `enqueue` and `dequeue`, so `length` is correct.
