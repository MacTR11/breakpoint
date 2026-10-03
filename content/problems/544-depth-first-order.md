--- meta
{ "title": "Depth-first search", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Graph traversal", "points": 10, "track": "algorithms", "specRef": "2.3.1",
  "options": ["A B D E F C", "A B C D E F", "A B D E C F", "A C F E B D"], "answer": 0 }
--- description
A graph has six nodes and these edges, each of which can be followed in either direction:

**A–B, A–C, B–D, B–E, C–F, E–F**

A **depth-first** traversal starts at A. Whenever it has a choice of unvisited neighbours, it takes the one that comes first alphabetically.

In what order are the nodes visited?
--- hints
- Depth-first keeps going along one path until it is stuck, then backs up to the most recent node with an unvisited neighbour.
- From B, D comes before E alphabetically, and D is a dead end.
--- explanation
Depth-first search goes as far as it can along one path before backing up.

- Start at **A**. Its neighbours are B and C, so go to **B**.
- B's unvisited neighbours are D and E, so go to **D**.
- D is a dead end, so back up to B and go to **E**.
- E's unvisited neighbour is **F**.
- F's unvisited neighbour is **C**.

The order is **A B D E F C**.

A breadth-first search would instead visit everything one step from A before going further: A B C D E F.
