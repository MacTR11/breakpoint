--- meta
{"title": "Fix: index out of range", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Index error", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "differences",
  "tests": [
    {"args": [[1, 4, 9]], "expected": [3, 5]},
    {"args": [[5, 5]], "expected": [0]},
    {"args": [[7]], "expected": []},
    {"args": [[]], "expected": [], "hidden": true},
    {"args": [[10, 3, 8, 8]], "expected": [-7, 5, 0], "hidden": true}
  ]
}
--- description
`differences(numbers)` should return a list of the gaps between neighbouring numbers: each number subtracted from the one after it. A list of 3 numbers has 2 gaps.

It crashes with an `IndexError`.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- The loop reads `numbers[i + 1]`. What is `i + 1` on the final time round the loop?
- A list of `n` items has `n - 1` neighbouring pairs, so the loop should run `len(numbers) - 1` times.
--- starter
def differences(numbers):
    result = []
    for i in range(len(numbers)):
        result.append(numbers[i + 1] - numbers[i])
    return result
--- solution
def differences(numbers):
    result = []
    for i in range(len(numbers) - 1):
        result.append(numbers[i + 1] - numbers[i])
    return result
