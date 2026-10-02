--- meta
{
  "title": "Arcade Change",
  "kind": "CODE",
  "difficulty": "HARD",
  "topic": "Dynamic programming",
  "points": 40,
  "track": "algorithms", "specRef": "2.2.2",
  "functionName": "change_ways",
  "tests": [
    { "args": [5, [1, 2, 5]], "expected": 4 },
    { "args": [3, [2]], "expected": 0 },
    { "args": [10, [10]], "expected": 1 },
    { "args": [0, [1, 2]], "expected": 1, "hidden": true },
    { "args": [10, [2, 5, 3, 6]], "expected": 5, "hidden": true },
    { "args": [100, [1, 2, 5, 10, 20, 50, 100]], "expected": 4563, "hidden": true },
    { "args": [7, [2, 4]], "expected": 0, "hidden": true },
    { "args": [4, [1, 2, 3]], "expected": 4, "hidden": true }
  ]
}
--- description
An arcade change machine holds an unlimited supply of certain coins.

Write a function `change_ways(amount, coins)` that returns the **number of different ways** the machine can pay out exactly `amount` pence using coins of the values in the list `coins`.

The order of the coins does not matter: `2 + 2 + 1` and `1 + 2 + 2` are the same way.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `change_ways(5, [1, 2, 5])` | `4` | `5`, `2+2+1`, `2+1+1+1`, `1+1+1+1+1` |
| `change_ways(3, [2])` | `0` | impossible |
| `change_ways(10, [10])` | `1` | |

There is exactly one way to pay out `0`: give no coins.

### Note

One hidden test asks for the number of ways to make £1 from standard UK coins. Trying every combination will be too slow, so think about building the answer up from smaller amounts.
--- hints
- Build a list `ways` where `ways[t]` is the number of ways to make the total `t`. `ways[0]` is 1.
- Take the coins **one at a time**. For each coin, go through the totals from that coin's value upwards and add `ways[total - coin]` to `ways[total]`.
--- starter
def change_ways(amount, coins):
    # Write your code here
    pass
--- solution
def change_ways(amount, coins):
    ways = [1] + [0] * amount
    for coin in coins:
        for total in range(coin, amount + 1):
            ways[total] += ways[total - coin]
    return ways[amount]
