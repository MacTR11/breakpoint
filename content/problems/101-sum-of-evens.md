--- meta
{
  "title": "Sum of Evens",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Lists",
  "points": 10,
  "track": "lists", "specRef": "2.2.1",
  "functionName": "sum_of_evens",
  "tests": [
    { "args": [[1, 2, 3, 4, 5, 6]], "expected": 12 },
    { "args": [[7, 9, 11]], "expected": 0 },
    { "args": [[]], "expected": 0 },
    { "args": [[-2, 3, -4]], "expected": -6, "hidden": true },
    { "args": [[0]], "expected": 0, "hidden": true },
    { "args": [[10, 20, 30, 41]], "expected": 60, "hidden": true },
    { "args": [[2]], "expected": 2, "hidden": true }
  ]
}
--- description
Write a function `sum_of_evens(numbers)` that returns the total of all the **even** numbers in a list of integers.

If the list has no even numbers (or is empty), return `0`.

### Examples

| Call | Returns |
| --- | --- |
| `sum_of_evens([1, 2, 3, 4, 5, 6])` | `12` |
| `sum_of_evens([7, 9, 11])` | `0` |
--- hints
- A number is even when `number % 2 == 0`.
- Start a `total` at 0, loop through the list, and add a number to the total only when it is even. Return the total after the loop.
--- starter
def sum_of_evens(numbers):
    # Write your code here
    pass
--- solution
def sum_of_evens(numbers):
    total = 0
    for number in numbers:
        if number % 2 == 0:
            total += number
    return total
