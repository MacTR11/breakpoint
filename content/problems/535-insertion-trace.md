--- meta
{ "title": "Insertion sort trace", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 10, "track": "sorting", "specRef": "2.3.1",
  "options": ["3 7 9 2 5", "2 3 5 7 9", "3 2 7 5 9", "2 3 7 9 5"], "answer": 3 }
--- description
An insertion sort is used to put this list into ascending order:

**7 3 9 2 5**

Each pass takes the next item and inserts it into the correct place among the items to its left. The first pass inserts the 3.

What does the list look like after the **third** pass?
--- hints
- Each pass picks up the next item and slides it left until it meets something smaller.
- Pass 1 handles the 3, pass 2 the 9, pass 3 the 2.
--- explanation
- Pass 1 inserts 3: **3 7** 9 2 5
- Pass 2 inserts 9, which is already in place: **3 7 9** 2 5
- Pass 3 inserts 2, which moves all the way to the front: **2 3 7 9** 5

After the third pass the list is **2 3 7 9 5**. The first four items are sorted among themselves; the 5 has not been looked at yet.
