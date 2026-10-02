--- meta
{ "title": "A* Decides", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Path finding", "points": 10, "track": "algorithms", "specRef": "2.3.1",
  "options": ["Route P", "Route Q", "Route R", "Route S"], "answer": 1 }
--- description
The A* algorithm is part-way through finding a route. It has four nodes it could explore next. For each one it knows the cost of getting there so far, and a heuristic estimate of the remaining distance to the goal.

| Node | Cost so far | Estimate to goal |
| --- | --- | --- |
| P | 4 | 9 |
| Q | 6 | 5 |
| R | 2 | 12 |
| S | 7 | 6 |

Which node does A* explore next?
--- hints
- A* adds two numbers together for each node and picks the smallest total.
--- explanation
A* always expands the node with the lowest value of **cost so far + heuristic estimate**:

- P: 4 + 9 = 13
- Q: 6 + 5 = **11**
- R: 2 + 12 = 14
- S: 7 + 6 = 13

So it explores **Q**.

Dijkstra's algorithm uses only the cost so far, and would have picked R. The heuristic is what steers A* towards the goal, so it usually examines fewer nodes.
