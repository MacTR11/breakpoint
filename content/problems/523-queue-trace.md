--- meta
{ "title": "At the front of the queue", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Queues", "points": 5, "track": "structures", "specRef": "1.4.2",
  "options": ["C, D, E", "E, D, C", "A, C, E", "B, C, D"], "answer": 0 }
--- description
A queue starts empty. These operations are carried out in order:

```
enqueue A
enqueue B
dequeue
enqueue C
enqueue D
dequeue
enqueue E
```

What does the queue contain at the end, listed from **front to back**?
--- hints
- A dequeue always removes the item that has been waiting longest.
- Write the queue out after every step, front on the left.
--- explanation
Track the queue after every step (front on the left):

`A` → `A B` → `B` → `B C` → `B C D` → `C D` → `C D E`

The queue ends as **C, D, E**. A queue is *first in, first out*: each dequeue removes whichever item has been waiting longest. (With a stack, the same steps would leave A, C, E.)
