--- meta
{"contest": "lower-sixth-league", "title": "Fix: the cheapest", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Logic errors", "points": 10, "track": "lists", "specRef": "3.3", "functionName": "cheapest",
  "tests": [
    {"args": [[4.5, 2.99, 3.2]], "expected": 1},
    {"args": [[5, 5, 1]], "expected": 2},
    {"args": [[1.5]], "expected": 0},
    {"args": [[9, 3, 3]], "expected": 1, "hidden": true},
    {"args": [[2, 8, 7, 0.5]], "expected": 3, "hidden": true}
  ]
}
--- description
  `cheapest(prices)` should return the position (index) of the lowest price in a list that is never empty. If the lowest price appears more than once, it returns the first position.

  There is **one** bug.

Fix the code in the editor so that every test passes.
--- hints
- What is `lowest` before the loop starts? Can any price ever be less than that?
- Start `lowest` at the first price, `prices[0]`, rather than at a value that may never be beaten.
--- starter
def cheapest(prices):
    lowest = 0
    position = 0
    for i in range(len(prices)):
        if prices[i] < lowest:
            lowest = prices[i]
            position = i
    return position
--- solution
def cheapest(prices):
    lowest = prices[0]
    position = 0
    for i in range(len(prices)):
        if prices[i] < lowest:
            lowest = prices[i]
            position = i
    return position
