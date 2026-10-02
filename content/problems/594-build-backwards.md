--- meta
{"title": "Building a String", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "strings", "specRef": "2.2.1", "check": "run", "options": ["abc", "cba", "c", "aaa"], "answer": 1}
--- description
```python
result = ""
for ch in "abc":
    result = ch + result
print(result)
```

What does this program print?
--- hints
- Each new character is put on the **front** of `result`, not the end.
--- explanation
Each character is joined to the front of what has been built so far:

- `"a" + ""` gives `"a"`
- `"b" + "a"` gives `"ba"`
- `"c" + "ba"` gives **`"cba"`**

Writing `result + ch` instead would rebuild the string in its original order.
