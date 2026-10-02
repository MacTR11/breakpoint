--- meta
{
  "title": "Hash Table with Linear Probing", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Hash tables", "points": 20, "track": "structures", "specRef": "1.4.2",
  "functionName": "hash_insert",
  "tests": [
    { "args": [[10, 22, 31], 5], "expected": [10, 31, 22, null, null] },
    { "args": [[5, 10, 15], 5], "expected": [5, 10, 15, null, null] },
    { "args": [[], 3], "expected": [null, null, null] },
    { "args": [[7, 14, 4], 7], "expected": [7, 14, null, null, 4, null, null], "hidden": true },
    { "args": [[6, 13, 20], 7], "expected": [13, 20, null, null, null, null, 6], "hidden": true },
    { "args": [[3], 1], "expected": [3], "hidden": true },
    { "args": [[15, 9, 22, 30], 7], "expected": [null, 15, 9, 22, 30, null, null], "hidden": true }
  ]
}
--- description
A hash table stores each key at the position given by a hash function. Here the hash function is `key MOD size`.

When that position is already taken (a **collision**), use **linear probing**: try the next position, then the next, wrapping round from the end of the table to the start, until you find an empty one.

Write a function `hash_insert(keys, size)` that inserts each key in order into an empty table with `size` positions, and returns the table as a list. Empty positions hold `None`.

There will never be more keys than positions.

### Examples

`hash_insert([10, 22, 31], 5)` returns `[10, 31, 22, None, None]`

- 10 MOD 5 = 0, so 10 goes in position 0
- 22 MOD 5 = 2, so 22 goes in position 2
- 31 MOD 5 = 1, so 31 goes in position 1

`hash_insert([5, 10, 15], 5)` returns `[5, 10, 15, None, None]`: all three keys hash to 0, so 10 and 15 are pushed along.
--- hints
- Start with `table = [None] * size`. The starting position for a key is `key % size`.
- While the position is taken, move on with `position = (position + 1) % size`. The `% size` is what wraps round to the start.
--- starter
def hash_insert(keys, size):
    # Write your code here
    pass
--- solution
def hash_insert(keys, size):
    table = [None] * size
    for key in keys:
        position = key % size
        while table[position] is not None:
            position = (position + 1) % size
        table[position] = key
    return table
