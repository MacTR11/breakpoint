--- meta
{
  "title": "A Simple Hash Function", "kind": "CODE", "difficulty": "EASY", "topic": "Hashing", "points": 10, "track": "strings", "specRef": "1.3.1",
  "functionName": "simple_hash",
  "tests": [
    { "args": ["A", 10], "expected": 5 },
    { "args": ["AB", 10], "expected": 1 },
    { "args": ["", 7], "expected": 0 },
    { "args": ["cat", 11], "expected": 4, "hidden": true },
    { "args": ["Cat", 11], "expected": 5, "hidden": true },
    { "args": ["hello", 100], "expected": 32, "hidden": true },
    { "args": ["act", 11], "expected": 4, "hidden": true }
  ]
}
--- description
A hash function turns a key into a number, which a hash table uses as the position to store it.

Write a function `simple_hash(text, size)` that adds up the character codes of every character in `text`, then returns that total **modulo** `size`.

`ord("A")` gives the character code of `"A"`, which is `65`.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `simple_hash("A", 10)` | `5` | 65 MOD 10 |
| `simple_hash("AB", 10)` | `1` | (65 + 66) MOD 10 |
| `simple_hash("", 7)` | `0` | |

### Think about it

`"cat"` and `"act"` give the same answer. What is that called, and why is it a weakness of this function?
--- hints
- `ord(character)` gives a character's code. Add up the codes of every character in a loop.
- The final answer is the total `% size`. An empty string has a total of 0.
--- starter
def simple_hash(text, size):
    # Write your code here
    pass
--- solution
def simple_hash(text, size):
    total = 0
    for character in text:
        total += ord(character)
    return total % size
