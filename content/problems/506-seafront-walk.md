--- meta
{ "title": "Seafront Shortcut", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Graphs", "points": 10, "track": "algorithms", "specRef": "2.3.1",
  "options": ["7 minutes", "8 minutes", "9 minutes", "10 minutes"], "answer": 1 }
--- description
The table shows how long it takes to walk directly between some places on the seafront. If a pair is not listed, there is no direct path between them.

| Path | Minutes |
| --- | --- |
| Tower – Arcade | 2 |
| Tower – Station | 3 |
| Tower – Pier | 4 |
| Arcade – Pier | 1 |
| Pier – Zoo | 5 |
| Station – Zoo | 7 |
| Arcade – Zoo | 8 |

What is the **shortest** time needed to walk from the **Tower** to the **Zoo**?
--- hints
- The route with the fewest paths is not always the shortest. Try going through the Arcade.
- List every route from the Tower to the Zoo and add up each one.
--- explanation
The possible routes are:

- Tower → Arcade → Pier → Zoo: 2 + 1 + 5 = **8**
- Tower → Pier → Zoo: 4 + 5 = 9
- Tower → Arcade → Zoo: 2 + 8 = 10
- Tower → Station → Zoo: 3 + 7 = 10

The shortest is **8 minutes**, and it is the route with the *most* steps. Sat-navs solve exactly this problem using a shortest-path algorithm such as Dijkstra's.
