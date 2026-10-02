--- meta
{"title": "Fewest Coins", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Loops and arithmetic", "points": 20, "track": "basics", "specRef": "2.2.1", "functionName": "coins",
  "tests": [
    {"args": [87], "expected": [50, 20, 10, 5, 2]},
    {"args": [0], "expected": []},
    {"args": [3], "expected": [2, 1]},
    {"args": [200], "expected": [200], "hidden": true},
    {"args": [399], "expected": [200, 100, 50, 20, 20, 5, 2, 2], "hidden": true},
    {"args": [1], "expected": [1], "hidden": true},
    {"args": [40], "expected": [20, 20], "hidden": true},
    {"args": [68], "expected": [50, 10, 5, 2, 1], "hidden": true}
  ]
}
--- description
A vending machine gives change using as few coins as possible. It has an unlimited supply of UK coins worth 200, 100, 50, 20, 10, 5, 2 and 1 pence.

Write a function `coins(pence)` that returns the list of coins it hands out, largest first.

### Examples

| Call | Returns |
| --- | --- |
| `coins(87)` | `[50, 20, 10, 5, 2]` |
| `coins(3)` | `[2, 1]` |
| `coins(0)` | `[]` |
--- hints
- Work through the coin values from largest to smallest.
- For each coin, keep handing it out `while` the amount left is at least that coin's value, subtracting it each time.
--- starter
def coins(pence):
    # Write your code here
    pass
--- solution
def coins(pence):
    result = []
    for coin in [200, 100, 50, 20, 10, 5, 2, 1]:
        while pence >= coin:
            result.append(coin)
            pence -= coin
    return result
