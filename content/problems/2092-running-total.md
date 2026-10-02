--- meta
{"title": "Arrays (b): running totals", "kind": "CODE", "difficulty": "EASY", "topic": "Arrays", "points": 10, "track": "exam", "specRef": "2.2.1", "functionName": "running_totals",
  "tests": [
    {"args": [[3, 1, 4]], "expected": [3, 4, 8]},
    {"args": [[10]], "expected": [10]},
    {"args": [[]], "expected": []},
    {"args": [[5, -5, 5, -5]], "expected": [5, 0, 5, 0], "hidden": true},
    {"args": [[1, 1, 1, 1, 1, 1]], "expected": [1, 2, 3, 4, 5, 6], "hidden": true},
    {"args": [[0, 0, 7]], "expected": [0, 0, 7], "hidden": true},
    {"args": [[100, 20, 3]], "expected": [100, 120, 123], "hidden": true}
  ]
}
--- description
A shop records how much it takes each day in an array. The manager wants to see the running total: how much had been taken by the end of each day.

Write the function `running_totals(amounts)`, which returns a **new** array of the same length. Each element is the sum of the amounts up to and including that position.

For example, `running_totals([3, 1, 4])` returns `[3, 4, 8]`. An empty array gives `[]`.

**[4 marks]**
--- hints
- Keep one variable `total`, starting at 0, and an empty result list.
- For each amount: add it to `total`, then append `total` to the result.
--- starter
def running_totals(amounts):
    pass
--- solution
def running_totals(amounts):
    totals = []
    total = 0
    for amount in amounts:
        total = total + amount
        totals.append(total)
    return totals
--- explanation
One mark each, up to 4:

- A total initialised to 0 and a new, empty array.
- Loops through the amounts in order.
- Adds each amount to the total, then stores the total in the new array.
- Returns the new array, leaving the original unchanged.
