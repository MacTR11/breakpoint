--- meta
{
  "title": "Flatten a nested list", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 25, "track": "recursion", "specRef": "2.2.1",
  "functionName": "flatten",
  "tests": [
    { "args": [[1, [2, [3, 4]], 5]], "expected": [1, 2, 3, 4, 5] },
    { "args": [[1, 2, 3]], "expected": [1, 2, 3] },
    { "args": [[]], "expected": [] },
    { "args": [[[], [[]]]], "expected": [], "hidden": true },
    { "args": [[[[["deep"]]]]], "expected": ["deep"], "hidden": true },
    { "args": [[[1, 2], [3, [4, [5, [6]]]]]], "expected": [1, 2, 3, 4, 5, 6], "hidden": true }
  ]
}
--- description
Some problems are naturally recursive, because the data contains smaller copies of itself.

Write a function `flatten(nested)` that takes a list which may contain other lists, nested to any depth, and returns a single flat list of all the values in order.

### Examples

| Call | Returns |
| --- | --- |
| `flatten([1, [2, [3, 4]], 5])` | `[1, 2, 3, 4, 5]` |
| `flatten([])` | `[]` |
--- hints
- `isinstance(item, list)` is `True` when `item` is itself a list.
- Loop through the items. If an item is a list, flatten **it** with a recursive call and add the results with `.extend()`. Otherwise `.append()` the item.
--- starter
def flatten(nested):
    # Write your code here
    pass
--- solution
def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result
