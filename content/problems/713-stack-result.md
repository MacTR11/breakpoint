--- meta
{"title": "What Comes Off?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Stacks", "points": 10, "track": "structures", "specRef": "1.4.2", "contest": "structures-derby", "options": ["3, 4, 2", "1, 2, 3", "3, 2, 1", "3, 4, 1"], "answer": 0}
--- description
A stack starts empty. These operations are carried out in order:

```
push 1
push 2
push 3
pop
push 4
pop
pop
```

Which values are popped, in the order they come off?
--- hints
- A pop always removes the item pushed most recently that is still on the stack.
- Write the stack out after every step.
--- explanation
Track the stack (top on the right):

`1` → `1 2` → `1 2 3` → pop **3** → `1 2` → `1 2 4` → pop **4** → `1 2` → pop **2** → `1`

The values popped are **3, 4, 2**, and 1 is left on the stack.
