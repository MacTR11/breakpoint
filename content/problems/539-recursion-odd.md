--- meta
{ "title": "Recursive mystery", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1",
  "options": ["35", "48", "5040", "105"], "answer": 3 }
--- description
```
function mystery(n)
    if n <= 1 then
        return 1
    else
        return n * mystery(n - 2)
    endif
endfunction
```

What does `mystery(7)` return?
--- hints
- Write out each call: `mystery(7)` needs `mystery(5)`, which needs `mystery(3)`, and so on.
- The base case returns 1. Now multiply back up the chain.
--- explanation
Each call multiplies `n` by the result of calling itself with `n − 2`, until it reaches the base case:

- `mystery(7)` = 7 × `mystery(5)`
- `mystery(5)` = 5 × `mystery(3)`
- `mystery(3)` = 3 × `mystery(1)`
- `mystery(1)` = 1 (the base case)

Unwinding: 3 × 1 = 3, then 5 × 3 = 15, then 7 × 15 = **105**.
