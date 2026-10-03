--- meta
{ "title": "How many halvings?", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Iteration", "points": 5, "track": "basics", "specRef": "2.2.1",
  "options": ["3", "4", "5", "10"], "answer": 1 }
--- description
```
x = 20
count = 0
while x > 1
    x = x DIV 2
    count = count + 1
endwhile
print(count)
```

What is printed?
--- hints
- `DIV` throws away the remainder: `5 DIV 2` is 2.
- Draw a trace table with columns for `x` and `count`.
--- explanation
`DIV` is integer division: it divides and throws away any remainder.

| x before | x after | count |
| --- | --- | --- |
| 20 | 10 | 1 |
| 10 | 5 | 2 |
| 5 | 2 | 3 |
| 2 | 1 | 4 |

When `x` is 1 the condition `x > 1` is false and the loop stops, so the program prints **4**.
