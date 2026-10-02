--- meta
{ "title": "Stack of Crates", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Data structures", "points": 5, "track": "structures", "specRef": "1.4.2",
  "options": ["A, C, E", "E", "B, D, C", "A, E"], "answer": 3 }
--- description
A delivery driver stacks crates one on top of another. **Push** puts a crate on top of the stack. **Pop** takes the top crate off.

Starting with an empty stack, the driver does this:

```
push A
push B
pop
push C
push D
pop
pop
push E
```

Which crates are in the stack at the end, listed from **bottom to top**?
--- hints
- A pop always removes the crate that was pushed most recently.
- Write the stack out after every single step.
--- explanation
Track the stack after every step (bottom on the left):

`A` → `A B` → `A` → `A C` → `A C D` → `A C` → `A` → `A E`

The stack ends as **A, E**. A stack is *last in, first out*: each pop removes whichever crate was added most recently.
