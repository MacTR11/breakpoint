--- meta
{ "title": "The greedy seagull", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Algorithms", "points": 20, "track": "algorithms", "specRef": "2.2.2", "contest": "welcome",
  "options": ["21", "22", "23", "25"], "answer": 2 }
--- description
A seagull is walking across a grid of paving slabs. The number on each slab is how many chips have been dropped there.

```
3  1  4
1  5  9
2  6  5
```

The seagull starts on the **top-left** slab and must finish on the **bottom-right** slab. It can only step **right** or **down**, and it eats the chips on every slab it visits, including the first and the last.

What is the **largest** number of chips it can eat?
--- hints
- Greedy choices can mislead. Work out the best possible total for reaching **each** slab.
- The best total for a slab is its own chips plus the larger of the best totals for the slab above and the slab to its left.
--- explanation
The best route is 3 → down to 1 → right to 5 → right to 9 → down to 5, eating 3 + 1 + 5 + 9 + 5 = **23** chips.

To be certain nothing beats it, work out the best total for reaching each slab, using the best totals of the slab above and the slab to the left:

```
3   4   8
4   9  18
6  15  23
```

Building a solution from the answers to smaller problems like this is called *dynamic programming*.
