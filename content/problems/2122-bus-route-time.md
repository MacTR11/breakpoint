--- meta
{"title": "Bus network (b): the time for a route", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Graphs", "points": 25, "track": "exam", "specRef": "2.3.1", "functionName": "route_time",
  "tests": [
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, ["Pier", "Tower", "Station", "Zoo"]], "expected": 13},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, ["Pier", "Zoo"]], "expected": -1},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, ["Station"]], "expected": 0},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, ["Pier", "Station", "Zoo"]], "expected": 15, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, ["A", "B", "C", "D", "A", "B"]], "expected": 6, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, ["E", "A", "D"]], "expected": -1, "hidden": true}
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

A route is a list of stops, such as `["Pier", "Tower", "Station", "Zoo"]`. Write the function `route_time(graph, route)`, which returns the total minutes for the route, travelling directly between each stop and the next. If any leg has no direct bus, it returns `-1`. A route of one stop takes 0 minutes.

With the example network, the route above takes 4 + 3 + 6 = `13` minutes.

You may use your function from part (a); if you do, include it in your answer.

**[5 marks]**
--- hints
- Look at each pair of neighbouring stops in the route: `route[i]` and `route[i + 1]`.
- Find each leg's time (part (a) does this). If any leg is -1, the whole route is -1; otherwise add them up.
--- starter
def route_time(graph, route):
    pass
--- solution
def direct(graph, a, b):
    for stop, minutes in graph[a]:
        if stop == b:
            return minutes
    return -1

def route_time(graph, route):
    total = 0
    for i in range(len(route) - 1):
        leg = direct(graph, route[i], route[i + 1])
        if leg == -1:
            return -1
        total = total + leg
    return total
--- explanation
One mark each, up to 5:

- Loops over each pair of neighbouring stops in the route.
- Finds the direct time for each leg.
- Returns `-1` as soon as a leg has no direct bus.
- Adds up the leg times.
- Returns the total (0 for a route of one stop).
