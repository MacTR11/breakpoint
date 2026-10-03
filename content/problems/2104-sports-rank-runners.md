--- meta
{"title": "Sports day (d): rank the runners", "kind": "CODE", "difficulty": "HARD", "topic": "Insertion sort on records", "points": 35, "track": "exam", "specRef": "2.2.1", "functionName": "rank_runners", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[["Ada", "01:23.45"], ["Ben", "01:19.80"], ["Cy", "02:01.00"]]], "expected": ["Ben", "Ada", "Cy"]},
    {"args": [[["Solo", "00:59.99"]]], "expected": ["Solo"]},
    {"args": [[]], "expected": []},
    {"args": [[["A", "00:10.10"], ["B", "00:10.01"], ["C", "00:10.00"], ["D", "00:09.99"]]], "expected": ["D", "C", "B", "A"], "hidden": true},
    {"args": [[["X", "01:00.00"], ["Y", "00:59.00"], ["Z", "10:00.00"]]], "expected": ["Y", "X", "Z"], "hidden": true}
  ]
}
--- description
The 800m results are a list of `[name, time]` pairs, where each time is a valid string in the form `mm:ss.hh` (see part (c)).

Write the function `rank_runners(runners)`, which uses an **insertion sort** to put the runners in order, fastest first, and returns a list of their names in that order. No two runners have the same time.

For example, `rank_runners([["Ada", "01:23.45"], ["Ben", "01:19.80"], ["Cy", "02:01.00"]])` returns `["Ben", "Ada", "Cy"]`.

Write the sort yourself: do not use `sorted` or `sort`.

**[7 marks]**
--- hints
- Turn each time into a single number before comparing, such as the total hundredths: minutes × 6000 + seconds × 100 + hundredths.
- Insertion sort: take each runner from the second onwards, and shuffle the **slower** runners already sorted one place to the right until you find the gap for it.
- Once the pairs are sorted, build the list of names from them.
--- starter
def rank_runners(runners):
    pass
--- solution
def hundredths(time):
    return int(time[0:2]) * 6000 + int(time[3:5]) * 100 + int(time[6:8])

def rank_runners(runners):
    order = list(runners)
    for i in range(1, len(order)):
        current = order[i]
        j = i
        while j > 0 and hundredths(order[j - 1][1]) > hundredths(current[1]):
            order[j] = order[j - 1]
            j = j - 1
        order[j] = current
    names = []
    for runner in order:
        names.append(runner[0])
    return names
--- explanation
One mark each, up to 7:

- Converts each time into a value that can be compared correctly (for example total hundredths).
- An outer loop over the runners from the second to the last.
- Stores the current runner.
- An inner loop that moves left while the earlier runner is slower.
- The inner loop stops at the start of the list.
- Inserts the stored runner into the gap.
- Returns the names, fastest first.
