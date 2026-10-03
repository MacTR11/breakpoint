--- meta
{"title": "Bus network (c): the fewest buses", "kind": "CODE", "difficulty": "HARD", "topic": "Breadth-first search", "points": 35, "track": "exam", "specRef": "2.3.1", "functionName": "fewest_buses",
  "tests": [
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Pier", "Zoo"], "expected": 2},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Pier", "Station"], "expected": 1},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Zoo", "Pier"], "expected": -1},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Tower", "Tower"], "expected": 0, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "A", "D"], "expected": 2, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "E", "D"], "expected": 3, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "D", "C"], "expected": 2, "hidden": true}
  ]
}
--- description
A bus company stores its network as a dictionary called `graph`. Each key is a stop, and its value is a list of `[next_stop, minutes]` pairs: the stops you can reach directly from it and how long that leg takes. Buses only go in the direction listed. For example:

```python
graph = {
    "Pier": [["Tower", 4], ["Station", 9]],
    "Tower": [["Station", 3], ["Zoo", 12]],
    "Station": [["Zoo", 6]],
    "Zoo": [],
}
```

Write the function `fewest_buses(graph, start, end)`, which uses a **breadth-first search** to return the smallest number of buses needed to get from `start` to `end`. If `end` cannot be reached it returns `-1`, and if `start` and `end` are the same it returns `0`.

With the example network, `fewest_buses(graph, "Pier", "Zoo")` returns `2` (for example Pier to Tower, then Tower to Zoo).

**[7 marks]**
--- hints
- Use a queue of `[stop, buses so far]` pairs, starting with `[start, 0]`, and a set of stops already visited.
- Take a pair off the front of the queue. If it is the end, return its count. Otherwise add every unvisited neighbour to the back, with the count plus 1.
- Breadth-first search visits all stops one bus away before any that are two away, so the first time you reach `end` is with the fewest buses.
--- starter
def fewest_buses(graph, start, end):
    pass
--- solution
def fewest_buses(graph, start, end):
    queue = [[start, 0]]
    visited = {start}
    while len(queue) > 0:
        stop, buses = queue.pop(0)
        if stop == end:
            return buses
        for next_stop, minutes in graph[stop]:
            if next_stop not in visited:
                visited.add(next_stop)
                queue.append([next_stop, buses + 1])
    return -1
--- explanation
One mark each, up to 7:

- A queue that starts with the start stop (and a count of 0).
- Records which stops have been visited, so none is visited twice.
- Removes items from the **front** of the queue.
- Returns the count when the end stop is reached.
- Adds each unvisited neighbour to the back of the queue.
- The count for a neighbour is one more than for the stop it was reached from.
- Returns `-1` when the queue empties without reaching the end.
