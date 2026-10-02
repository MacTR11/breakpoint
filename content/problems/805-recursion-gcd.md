--- meta
{ "title": "Recursive Trace", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "contest": "algorithms-showdown",
  "options": ["2", "3", "6", "12"], "answer": 2 }
--- description
```
function f(a, b)
    if b == 0 then
        return a
    else
        return f(b, a MOD b)
    endif
endfunction
```

What does `f(48, 18)` return?
--- hints
- `48 MOD 18` is the remainder when 48 is divided by 18.
- Write down the two arguments of each call until `b` is 0.
--- explanation
Trace each call. `MOD` gives the remainder after division.

- `f(48, 18)`: 48 MOD 18 = 12, so call `f(18, 12)`
- `f(18, 12)`: 18 MOD 12 = 6, so call `f(12, 6)`
- `f(12, 6)`: 12 MOD 6 = 0, so call `f(6, 0)`
- `f(6, 0)`: `b` is 0, the base case, so return **6**

That value is passed straight back up through every call. This is Euclid's algorithm: it finds the highest common factor of two numbers.
