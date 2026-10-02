--- meta
{
  "title": "Largest Gap",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Lists",
  "points": 10,
  "track": "lists", "specRef": "2.2.1",
  "contest": "welcome",
  "functionName": "largest_gap",
  "tests": [
    { "args": [[1, 4, 2, 9]], "expected": 7 },
    { "args": [[5, 5]], "expected": 0 },
    { "args": [[10, 3]], "expected": 7 },
    { "args": [[1, 2, 3, 4]], "expected": 1, "hidden": true },
    { "args": [[-5, 5, 0]], "expected": 10, "hidden": true },
    { "args": [[8, 1, 7, 2, 6]], "expected": 7, "hidden": true },
    { "args": [[0, 0, 0, 100]], "expected": 100, "hidden": true }
  ]
}
--- description
Write a function `largest_gap(numbers)` that returns the biggest difference between any two **neighbouring** values in a list.

The difference is always given as a positive number (or zero), whichever neighbour is larger. The list always contains at least two numbers.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `largest_gap([1, 4, 2, 9])` | `7` | between 2 and 9 |
| `largest_gap([10, 3])` | `7` | |
| `largest_gap([5, 5])` | `0` | |
--- hints
- Compare each item with the next one: loop `i` from 0 to `len(numbers) - 2`.
- `abs(a - b)` gives the size of a difference whichever is larger. Keep track of the biggest one you see.
--- starter
def largest_gap(numbers):
    # Write your code here
    pass
--- solution
def largest_gap(numbers):
    return max(abs(numbers[i] - numbers[i + 1]) for i in range(len(numbers) - 1))
