--- meta
{"title": "Quick sort's bad day", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Quick sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "options": ["A list that is already in order", "A list in random order", "A list where each pivot happens to be the middle value", "A list of two items"], "answer": 0}
--- description
A quick sort always chooses the **first item** as its pivot.

On which of these lists does it do the most work for its size?
--- hints
- Quick sort is fast when the pivot splits the list into two roughly equal parts.
- If the first item is the smallest, how big are the two parts?
--- explanation
Quick sort is efficient when each pivot splits the list roughly in half.

With **a list that is already in order**, the first item is always the smallest. Nothing is smaller than the pivot, so one part is empty and the other holds everything else. The list shrinks by only one item each time, and the algorithm slows from O(n log n) to O(n²).

That is why real implementations pick the pivot more carefully, for example from the middle or at random.
