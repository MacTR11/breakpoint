--- meta
{"contest": "winter-cracker", "title": "Loading the sleigh", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "sleigh_load",
  "tests": [
    {"args": [[3, 5, 2, 8], 10], "expected": 3},
    {"args": [[12, 1], 10], "expected": 0},
    {"args": [[], 5], "expected": 0},
    {"args": [[2, 2, 2], 6], "expected": 3, "hidden": true},
    {"args": [[4, 4, 1, 1], 8], "expected": 2, "hidden": true},
    {"args": [[1, 9, 1], 10], "expected": 2, "hidden": true}
  ]
}
--- description
Parcels are loaded on to a sleigh in the order they are in the list. The sleigh can carry at most `limit` kilograms, and loading stops at the first parcel that would take it over the limit, even if a lighter parcel comes later.

Write `sleigh_load(weights, limit)`, which returns how many parcels get loaded. For example `sleigh_load([3, 5, 2, 8], 10)` is `3`: 3 + 5 + 2 is 10, and the 8 would go over.
--- hints
- Keep a running total and a count. Before adding a parcel, check whether it would take the total over the limit.
- `break` leaves a loop straight away.
--- starter
def sleigh_load(weights, limit):
    # Write your code here
    pass
--- solution
def sleigh_load(weights, limit):
    total = 0
    count = 0
    for weight in weights:
        if total + weight > limit:
            break
        total = total + weight
        count = count + 1
    return count
