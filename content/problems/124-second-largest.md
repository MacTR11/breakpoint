--- meta
{
  "title": "Second largest", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1",
  "functionName": "second_largest", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[3, 9, 4]], "expected": 4 },
    { "args": [[5, 5, 2]], "expected": 2 },
    { "args": [[1, 2]], "expected": 1 },
    { "args": [[-1, -5, -3]], "expected": -3, "hidden": true },
    { "args": [[7, 7, 7, 6]], "expected": 6, "hidden": true },
    { "args": [[10, 9, 10, 8]], "expected": 9, "hidden": true },
    { "args": [[2, 1, 2, 1]], "expected": 1, "hidden": true }
  ]
}
--- description
Write a function `second_largest(numbers)` that returns the second largest **different** value in a list.

So in `[5, 5, 2]` the largest value is 5 and the second largest is 2. The list always contains at least two different values.

Do it in a single pass through the list: `sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `second_largest([3, 9, 4])` | `4` |
| `second_largest([5, 5, 2])` | `2` |
--- hints
- Keep two variables as you go through the list: the largest value seen so far and the second largest. Start them both as `None`.
- A number bigger than the largest pushes the old largest down into second place. A number between the two replaces the second. A number equal to the largest changes nothing.
--- starter
def second_largest(numbers):
    # Write your code here
    pass
--- solution
def second_largest(numbers):
    largest = None
    second = None
    for number in numbers:
        if largest is None or number > largest:
            second = largest
            largest = number
        elif number != largest and (second is None or number > second):
            second = number
    return second
