--- meta
{"title": "Bus network (a): a direct bus", "kind": "CODE", "difficulty": "EASY", "topic": "Graphs", "points": 15, "track": "exam", "specRef": "2.3.1", "functionName": "direct",
  "tests": [
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Pier", "Tower"], "expected": 4},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Tower", "Pier"], "expected": -1},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Pier", "Zoo"], "expected": -1},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Station", "Zoo"], "expected": 6, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "D", "A"], "expected": 2, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "A", "D"], "expected": -1, "hidden": true}
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

Write the function `direct(graph, a, b)`, which returns the number of minutes for the direct bus from stop `a` to stop `b`, or `-1` if there is no direct bus. Both stops are in the graph.

With the example network, `direct(graph, "Pier", "Tower")` returns `4` and `direct(graph, "Tower", "Pier")` returns `-1`.

**[3 marks]**
--- hints
- Loop through `graph[a]`. Each item is a pair `[stop, minutes]`.
- Return the minutes when the stop is `b`. If the loop ends, return -1.
--- starter
def direct(graph, a, b):
    pass
--- solution
def direct(graph, a, b):
    for stop, minutes in graph[a]:
        if stop == b:
            return minutes
    return -1
--- explanation
One mark each, up to 3:

- Looks through the list of direct buses from `a`.
- Returns the minutes when the destination is `b`.
- Returns `-1` only after checking every direct bus.
