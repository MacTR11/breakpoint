--- meta
{"title": "Pairs out of order", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Counting", "points": 25, "track": "algorithms", "specRef": "2.3.1", "functionName": "out_of_order",
  "tests": [
    {"args": [[2, 4, 1, 3, 5]], "expected": 3},
    {"args": [[1, 2, 3]], "expected": 0},
    {"args": [[3, 2, 1]], "expected": 3},
    {"args": [[]], "expected": 0, "hidden": true},
    {"args": [[5, 5, 5]], "expected": 0, "hidden": true},
    {"args": [[1, 3, 2, 3, 1]], "expected": 4, "hidden": true}
  ]
}
--- description
A pair of positions `i < j` is **out of order** if `items[i] > items[j]`. Counting these pairs measures how far a list is from sorted: a sorted list has none.

Write the function `out_of_order(items)`, which returns how many out-of-order pairs there are.

For example, `out_of_order([2, 4, 1, 3, 5])` returns `3`: (2, 1), (4, 1) and (4, 3).
--- hints
- Two loops: `i` over every position, and `j` over every position after `i`.
- Count a pair when `items[i] > items[j]`. Equal items are not out of order.
--- starter
def out_of_order(items):
    pass
--- solution
def out_of_order(items):
    count = 0
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] > items[j]:
                count = count + 1
    return count
