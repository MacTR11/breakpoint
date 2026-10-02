--- meta
{ "title": "One Pass of the Token Sorter", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Algorithms", "points": 10, "track": "sorting", "specRef": "2.3.1",
  "options": ["2 5 8 1 4", "2 1 4 5 8", "2 5 1 4 8", "1 2 4 5 8"], "answer": 2 }
--- description
An arcade machine sorts numbered tokens. It works along the row from left to right, looking at each pair of neighbours in turn. If the left token of the pair is larger than the right one, it **swaps** them, then moves one place along.

The tokens start in this order:

**5 2 8 1 4**

What order are the tokens in after the machine has worked along the row **once**?
--- hints
- Compare positions 1 and 2, then 2 and 3, and so on. Use the list as it is **after** each swap for the next comparison.
--- explanation
Follow each comparison:

1. `5 2` → swap → **2 5** 8 1 4
2. `5 8` → no swap → 2 **5 8** 1 4
3. `8 1` → swap → 2 5 **1 8** 4
4. `8 4` → swap → 2 5 1 **4 8**

After one pass the row is **2 5 1 4 8**. The largest token has "bubbled" to the end, which is where bubble sort gets its name. It needs more passes to finish the job.
