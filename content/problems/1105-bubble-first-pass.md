--- meta
{"title": "After one pass", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Bubble sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "contest": "sort-it-out", "options": ["1 4 2 5 8", "1 2 4 5 8", "1 5 4 2 8", "5 1 2 4 8"], "answer": 0}
--- description
A bubble sort is used to put this list into ascending order:

**5 1 4 2 8**

What does the list look like after the **first** pass?
--- hints
- A pass compares each neighbouring pair from left to right, swapping when the left one is larger.
- Use the list as it stands after each swap for the next comparison.
--- explanation
- `5 1` → swap → **1 5** 4 2 8
- `5 4` → swap → 1 **4 5** 2 8
- `5 2` → swap → 1 4 **2 5** 8
- `5 8` → no swap

After one pass the list is **1 4 2 5 8**. It takes one more pass to finish sorting, and a third to confirm there is nothing left to swap.
