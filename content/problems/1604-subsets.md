--- meta
{"title": "Every subset", "kind": "CODE", "difficulty": "HARD", "topic": "Recursion", "points": 50, "track": "recursion", "specRef": "2.2.1", "functionName": "subsets", "banned": ["itertools", "combinations("],
  "tests": [
    {"args": [[1, 2]], "expected": [[], [2], [1], [1, 2]]},
    {"args": [[]], "expected": [[]]},
    {"args": [["a"]], "expected": [[], ["a"]]},
    {"args": [[1, 2, 3]], "expected": [[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]], "hidden": true},
    {"args": [[3, 1, 2]], "expected": [[], [2], [1], [1, 2], [3], [3, 2], [3, 1], [3, 1, 2]], "hidden": true}
  ]
}
--- description
Write a **recursive** function `subsets(items)`, which returns every subset of the list `items` (a list of distinct numbers or letters), including the empty one and `items` itself. Each subset is a list in the same order as `items`.

Return them in this order: subsets that leave out the first item come before those that include it, and within each half the same rule applies to the next item.

For example, `subsets([1, 2])` returns `[[], [2], [1], [1, 2]]`.

Do not use `itertools`.
--- hints
- The base case: the only subset of an empty list is the empty list, so return `[[]]`.
- For a longer list, find the subsets of `items[1:]`. The answer is those subsets, followed by each of them with `items[0]` put on the front.
--- starter
def subsets(items):
    pass
--- solution
def subsets(items):
    if len(items) == 0:
        return [[]]
    rest = subsets(items[1:])
    with_first = []
    for subset in rest:
        with_first.append([items[0]] + subset)
    return rest + with_first
