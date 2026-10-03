--- meta
{
  "title": "Balanced brackets",
  "kind": "CODE",
  "difficulty": "MEDIUM",
  "topic": "Data structures",
  "points": 25,
  "track": "structures", "specRef": "1.4.2",
  "contest": "welcome",
  "functionName": "is_balanced",
  "tests": [
    { "args": ["(a + b) * [c]"], "expected": true },
    { "args": ["(]"], "expected": false },
    { "args": ["((("], "expected": false },
    { "args": [""], "expected": true, "hidden": true },
    { "args": ["{[()]}"], "expected": true, "hidden": true },
    { "args": ["([)]"], "expected": false, "hidden": true },
    { "args": [")("], "expected": false, "hidden": true },
    { "args": ["print(data[0])"], "expected": true, "hidden": true },
    { "args": ["}"], "expected": false, "hidden": true }
  ]
}
--- description
Code editors check that every bracket you open is closed again in the right order.

Write a function `is_balanced(text)` that returns `True` if the round `()`, square `[]` and curly `{}` brackets in `text` are balanced, and `False` otherwise. All other characters should be ignored.

Brackets are balanced when every opening bracket is closed by the same type of bracket, and brackets are closed in the reverse of the order they were opened.

### Examples

| Call | Returns |
| --- | --- |
| `is_balanced("(a + b) * [c]")` | `True` |
| `is_balanced("(]")` | `False` |
| `is_balanced("(((")` | `False` |
--- hints
- Use a stack. Push every opening bracket you meet.
- For a closing bracket, the stack must not be empty and the bracket you pop must be its partner. At the end the stack must be empty.
--- starter
def is_balanced(text):
    # Write your code here
    pass
--- solution
def is_balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack
