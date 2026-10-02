--- meta
{ "title": "By Value, By Reference", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Parameter passing", "points": 15, "track": "recursion", "specRef": "2.2.1",
  "options": ["3", "13", "23", "33"], "answer": 2 }
--- description
```
procedure update(a:byVal, b:byRef)
    a = a + 10
    b = b + 20
endprocedure

x = 1
y = 2
update(x, y)
print(x + y)
```

What is printed?
--- hints
- By value means the procedure works on a copy. By reference means it works on the original variable.
- Which of `x` and `y` can the procedure actually change?
--- explanation
`a` is passed **by value**: the procedure gets a copy of `x`. Changing `a` to 11 does nothing to `x`, which stays 1.

`b` is passed **by reference**: the procedure is given the location of `y` itself. Adding 20 to `b` changes `y` to 22.

So the program prints 1 + 22 = **23**.
