--- meta
{"title": "Stopping Early", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Bubble sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "options": ["1", "2", "4", "5"], "answer": 1}
--- description
A bubble sort keeps making passes through the list, and stops after the first pass in which **no swaps** are made.

It is used on this list:

**2 1 3 4 5**

How many passes does it make in total?
--- hints
- What does the list look like after the first pass?
- The algorithm cannot know the list is sorted until it has made a whole pass without swapping.
--- explanation
- Pass 1 swaps 2 and 1, giving `1 2 3 4 5`. A swap was made, so it must go round again.
- Pass 2 makes no swaps, which proves the list is sorted, so it stops.

That is **2** passes. Without the early-stop flag, a list of 5 items would always take 4 passes, however close to sorted it started.
