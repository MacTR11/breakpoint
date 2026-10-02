--- meta
{ "title": "Big O: What Is It Doing?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Complexity", "points": 10, "track": "searching", "specRef": "2.3.1", "contest": "algorithms-showdown",
  "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "answer": 1 }
--- description
```
function find(items, target)
    low = 0
    high = items.length - 1
    while low <= high
        mid = (low + high) DIV 2
        if items[mid] == target then
            return mid
        elseif items[mid] < target then
            low = mid + 1
        else
            high = mid - 1
        endif
    endwhile
    return -1
endfunction
```

What is the worst-case time complexity of this function, where `n` is the number of items?
--- hints
- How much of the list is left to search after each time round the loop?
--- explanation
This is a binary search. Every time round the loop, the part of the list still being considered (from `low` to `high`) is cut in half.

A list of `n` items can only be halved about log₂ n times before nothing is left, so the worst case is **O(log n)**: logarithmic time. Doubling the size of the list adds just one more step.
