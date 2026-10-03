--- meta
{"contest": "trace-race", "title": "Trace: checking brackets with a stack", "kind": "PUZZLE", "style": "TRACE", "difficulty": "MEDIUM", "topic": "Trace tables", "points": 15, "track": "structures", "specRef": "1.4.2", "options": {"columns": ["ch", "stack", "output"], "rows": [["", "[]", ""], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null], [null, null, null]]}, "answer": [["", "[]", ""], ["(", "['(']", ""], ["a", "['(']", ""], ["[", "['(', '[']", ""], ["b", "['(', '[']", ""], ["]", "['(']", ""], [")", "[]", ""], [")", "[]", "0"]]}
--- description
```python
text = "(a[b])"
stack = []
for ch in text:
    if ch in "([":
        stack.append(ch)
    elif ch in ")]":
        stack.pop()
print(len(stack))
```

Complete the trace table for this program. The first row shows the values before the loop starts. Each row after that shows every variable's value at the end of one time round the loop, and the last row shows what it prints at the end. Write the list as Python would print it, such as `['(']`. Write a value in every box, even if it has not changed.
--- hints
- An opening bracket is pushed on to the end of the list; a closing bracket pops the last one off.
- Letters are neither, so the stack does not change for them.
--- explanation
The stack grows `['(']`, then `['(', '[']` at the `[`, shrinks back to `['(']` at the `]` and to `[]` at the `)`. Letters leave it alone. It prints `0`: every bracket was closed.

A full bracket checker also checks that each closing bracket matches the one it pops, and that the stack is not empty when it pops.
