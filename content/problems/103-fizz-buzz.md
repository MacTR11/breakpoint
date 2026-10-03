--- meta
{
  "title": "FizzBuzz",
  "kind": "CODE",
  "difficulty": "EASY",
  "topic": "Loops",
  "points": 10,
  "track": "basics", "specRef": "2.2.1",
  "functionName": "fizz_buzz",
  "tests": [
    { "args": [5], "expected": ["1", "2", "Fizz", "4", "Buzz"] },
    { "args": [1], "expected": ["1"] },
    { "args": [15], "expected": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
    { "args": [0], "expected": [], "hidden": true },
    { "args": [3], "expected": ["1", "2", "Fizz"], "hidden": true },
    { "args": [10], "expected": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz"], "hidden": true },
    { "args": [16], "expected": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz", "16"], "hidden": true }
  ]
}
--- description
Write a function `fizz_buzz(n)` that returns a **list of strings** for the numbers `1` to `n`:

- multiples of 3 become `"Fizz"`
- multiples of 5 become `"Buzz"`
- multiples of both 3 and 5 become `"FizzBuzz"`
- every other number becomes that number as a string, e.g. `"7"`

### Example

`fizz_buzz(5)` returns `["1", "2", "Fizz", "4", "Buzz"]`

If `n` is `0`, return an empty list.
--- hints
- Check for multiples of both 3 and 5 **first**. If you check for 3 first, 15 is caught too early.
- `str(i)` turns a number into a string, and `result.append(...)` adds an item to a list.
--- starter
def fizz_buzz(n):
    # Write your code here
    pass
--- solution
def fizz_buzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result
