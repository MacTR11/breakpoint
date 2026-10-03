--- meta
{
  "title": "Dijkstra's Shortest Path", "kind": "CODE", "difficulty": "HARD", "topic": "Graphs", "points": 50, "track": "algorithms", "specRef": "2.3.1",
  "functionName": "shortest_distance",
  "tests": [
    { "args": [{ "A": { "B": 1 }, "B": { "A": 1, "C": 2 }, "C": { "B": 2 } }, "A", "C"], "expected": 3 },
    { "args": [{ "A": { "B": 5, "C": 1 }, "B": { "A": 5, "C": 2 }, "C": { "A": 1, "B": 2 }, "D": {} }, "A", "B"], "expected": 3 },
    { "args": [{ "A": { "B": 5, "C": 1 }, "B": { "A": 5, "C": 2 }, "C": { "A": 1, "B": 2 }, "D": {} }, "A", "D"], "expected": -1 },
    { "args": [{ "A": { "B": 1 }, "B": { "A": 1 } }, "A", "A"], "expected": 0, "hidden": true },
    { "args": [{ "Tower": { "Arcade": 2, "Station": 3, "Pier": 4 }, "Arcade": { "Tower": 2, "Pier": 1, "Zoo": 8 }, "Pier": { "Tower": 4, "Arcade": 1, "Zoo": 5 }, "Station": { "Tower": 3, "Zoo": 7 }, "Zoo": { "Pier": 5, "Station": 7, "Arcade": 8 } }, "Tower", "Zoo"], "expected": 8, "hidden": true },
    { "args": [{ "S": { "A": 7, "B": 2 }, "A": { "S": 7, "B": 3, "T": 1 }, "B": { "S": 2, "A": 3, "T": 8 }, "T": { "A": 1, "B": 8 } }, "S", "T"], "expected": 6, "hidden": true },
    { "args": [{ "X": {} }, "X", "X"], "expected": 0, "hidden": true }
  ]
}
--- description
Dijkstra's algorithm finds the shortest route between two nodes in a weighted graph.

Write a function `shortest_distance(graph, start, end)` that returns the **total length** of the shortest route from `start` to `end`, or `-1` if there is no route.

`graph` is a dictionary. Each key is a node, and its value is a dictionary of that node's neighbours and the distance to each. Distances are positive whole numbers.

### Example

```python
graph = {
    "A": {"B": 5, "C": 1},
    "B": {"A": 5, "C": 2},
    "C": {"A": 1, "B": 2},
    "D": {},
}
shortest_distance(graph, "A", "B")   # 3, going A → C → B
shortest_distance(graph, "A", "D")   # -1, D cannot be reached
```

### Reminder of the algorithm

1. Give every node a distance of infinity, except the start, which is 0.
2. Pick the unvisited node with the smallest distance and mark it visited.
3. For each of its neighbours, if going via this node is shorter than the neighbour's current distance, update it.
4. Repeat from step 2 until the end node has been visited or no reachable nodes are left.
--- hints
- Keep a dictionary of the best distance found so far to every node (infinity to begin with, 0 for the start) and a set of unvisited nodes.
- Repeatedly pick the unvisited node with the smallest distance. If that distance is still infinity, the rest cannot be reached. Otherwise update each neighbour if going through this node is shorter.
--- starter
def shortest_distance(graph, start, end):
    # Write your code here
    pass
--- solution
def shortest_distance(graph, start, end):
    infinity = float("inf")
    distances = {}
    for node in graph:
        distances[node] = infinity
    distances[start] = 0
    unvisited = set(graph)
    while unvisited:
        current = None
        for node in unvisited:
            if current is None or distances[node] < distances[current]:
                current = node
        if distances[current] == infinity:
            break
        if current == end:
            return distances[current]
        unvisited.remove(current)
        for neighbour, weight in graph[current].items():
            if distances[current] + weight < distances[neighbour]:
                distances[neighbour] = distances[current] + weight
    return -1
