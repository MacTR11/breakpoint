--- meta
{"title": "Big O: Two Calls Each", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Complexity", "points": 20, "track": "algorithms", "specRef": "2.3.1", "contest": "grand-final", "options": ["O(n)", "O(n²)", "O(log n)", "O(2ⁿ)"], "answer": 3}
--- description
```
function mystery(n)
    if n <= 1 then
        return 1
    endif
    return mystery(n - 1) + mystery(n - 1)
endfunction
```

What is the time complexity of this function?
--- hints
- How many calls does `mystery(3)` make in total? What about `mystery(4)`?
- Every call that is not the base case makes **two** more calls, each on a problem only one smaller.
--- explanation
Each call makes two further calls, and the problem only shrinks by 1 each time. So the number of calls doubles at every level: 1, 2, 4, 8 and so on, for `n` levels.

That is about 2ⁿ calls in total, so the complexity is **O(2ⁿ)**: exponential time. Adding 1 to `n` doubles the running time.

Writing `2 * mystery(n - 1)` instead would give the same answer in O(n).
