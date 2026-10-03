--- meta
{"title": "Bus network (d): the quickest journey", "kind": "CODE", "difficulty": "HARD", "topic": "Dijkstra's algorithm", "points": 45, "track": "exam", "specRef": "2.3.1", "functionName": "quickest",
  "tests": [
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Pier", "Zoo"], "expected": 13},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Pier", "Station"], "expected": 7},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Zoo", "Pier"], "expected": -1},
    {"args": [{"Pier": [["Tower", 4], ["Station", 9]], "Tower": [["Station", 3], ["Zoo", 12]], "Station": [["Zoo", 6]], "Zoo": []}, "Tower", "Tower"], "expected": 0, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "A", "D"], "expected": 3, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "E", "D"], "expected": 4, "hidden": true},
    {"args": [{"A": [["B", 1], ["C", 5]], "B": [["C", 1], ["D", 7]], "C": [["D", 1]], "D": [["A", 2]], "E": [["A", 1]]}, "D", "C"], "expected": 4, "hidden": true}
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

Write the function `quickest(graph, start, end)`, which uses **Dijkstra's algorithm** to return the fewest minutes needed to travel from `start` to `end`, changing buses as often as needed. If `end` cannot be reached it returns `-1`, and if `start` and `end` are the same it returns `0`.

With the example network, `quickest(graph, "Pier", "Zoo")` returns `13`: Pier to Tower (4), Tower to Station (3), Station to Zoo (6). That beats Pier to Tower to Zoo (16) and Pier to Station to Zoo (15).

**[9 marks]**
--- hints
- Keep a dictionary of the best time found so far to each stop, starting with `start` at 0, and a set of stops whose time is final.
- Repeatedly pick the unfinished stop with the smallest known time, mark it finished, and for each of its neighbours see whether going through it is quicker than the neighbour's best time so far.
- Stop when you finish `end` (return its time), or when no unfinished stop has a known time (return -1).
--- starter
def quickest(graph, start, end):
    pass
--- solution
def quickest(graph, start, end):
    best = {start: 0}
    finished = set()
    while True:
        current = None
        for stop in best:
            if stop not in finished and (current is None or best[stop] < best[current]):
                current = stop
        if current is None:
            return -1
        if current == end:
            return best[current]
        finished.add(current)
        for next_stop, minutes in graph[current]:
            time = best[current] + minutes
            if next_stop not in best or time < best[next_stop]:
                best[next_stop] = time
--- explanation
One mark each, up to 9:

- Records a best-known time for each stop, with the start at 0.
- Keeps track of which stops are finished (visited).
- Repeatedly chooses the unfinished stop with the smallest known time.
- Marks that stop as finished.
- Looks at every direct bus from that stop.
- Works out the time to each neighbour through the current stop.
- Updates a neighbour's time only when the new time is smaller (or it had none).
- Returns the time when the end stop is finished.
- Returns `-1` when the end cannot be reached.
