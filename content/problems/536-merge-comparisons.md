--- meta
{ "title": "Counting the Merge", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 10, "track": "sorting", "specRef": "2.3.1",
  "options": ["1", "2", "3", "4"], "answer": 2 }
--- description
In the final step of a merge sort, these two sorted lists are merged into one:

**[2, 9]** and **[4, 5]**

The merge repeatedly compares the front item of each list and moves the smaller one to the output. When one list is empty, whatever remains in the other is copied across without any more comparisons.

How many **comparisons** are made?
--- hints
- Each comparison moves exactly one item to the output.
- Once one list is empty, the rest is copied across with no more comparisons.
--- explanation
- Compare 2 and 4: take 2. Lists are now [9] and [4, 5].
- Compare 9 and 4: take 4. Lists are now [9] and [5].
- Compare 9 and 5: take 5. Lists are now [9] and [].
- The second list is empty, so 9 is copied across with no comparison.

That is **3** comparisons, giving [2, 4, 5, 9].
