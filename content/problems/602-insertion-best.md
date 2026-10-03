--- meta
{"title": "The best case", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Insertion sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "options": ["0", "5", "15", "36"], "answer": 1}
--- description
An insertion sort is run on a list of **6** items that happens to be **already sorted**.

On each pass it compares the next item with the one to its left, and only keeps going left if that neighbour is larger.

How many comparisons does it make in total?
--- hints
- A list of 6 items needs 5 passes.
- If the list is already sorted, how many comparisons does each pass need before it can stop?
--- explanation
There are 5 passes (for the 2nd to the 6th item). On each one, the item is compared with its left-hand neighbour, found to be in the right place already, and left alone.

One comparison per pass gives **5**. This best case is O(n), which makes insertion sort a good choice for data that is nearly sorted. The worst case, a reversed list, would need 15.
