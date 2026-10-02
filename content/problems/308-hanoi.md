--- meta
{
  "title": "Towers of Hanoi", "kind": "CODE", "difficulty": "HARD", "topic": "Recursion", "points": 40, "track": "recursion", "specRef": "2.2.1",
  "functionName": "hanoi",
  "tests": [
    { "args": [1], "expected": [["A", "C"]] },
    { "args": [2], "expected": [["A", "B"], ["A", "C"], ["B", "C"]] },
    { "args": [0], "expected": [] },
    { "args": [3], "expected": [["A", "C"], ["A", "B"], ["C", "B"], ["A", "C"], ["B", "A"], ["B", "C"], ["A", "C"]], "hidden": true },
    { "args": [4], "expected": [["A", "B"], ["A", "C"], ["B", "C"], ["A", "B"], ["C", "A"], ["C", "B"], ["A", "B"], ["A", "C"], ["B", "C"], ["B", "A"], ["C", "A"], ["B", "C"], ["A", "B"], ["A", "C"], ["B", "C"]], "hidden": true }
  ]
}
--- description
In the Towers of Hanoi puzzle there are three pegs, `A`, `B` and `C`. A stack of `n` discs sits on peg `A`, largest at the bottom. The goal is to move the whole stack to peg `C`.

- Only one disc may be moved at a time.
- A disc may never be placed on top of a smaller one.

Write a function `hanoi(n)` that returns the list of moves that solves the puzzle in the fewest moves. Each move is a list `[from_peg, to_peg]`.

### Examples

| Call | Returns |
| --- | --- |
| `hanoi(1)` | `[["A", "C"]]` |
| `hanoi(2)` | `[["A", "B"], ["A", "C"], ["B", "C"]]` |
| `hanoi(0)` | `[]` |

### The recursive idea

To move `n` discs from a source peg to a target peg using a spare peg:

1. move the top `n − 1` discs from the source to the spare
2. move the largest disc from the source to the target
3. move the `n − 1` discs from the spare to the target

Steps 1 and 3 are the same problem with one disc fewer.
--- hints
- Write a helper with more parameters: `move(n, source, target, spare, moves)`. Its base case is `n == 0`, which does nothing.
- Inside it: move `n - 1` discs from the source to the **spare**, append `[source, target]`, then move `n - 1` discs from the spare to the target.
--- starter
def hanoi(n):
    # Write your code here
    pass
--- solution
def move(n, source, target, spare, moves):
    if n == 0:
        return
    move(n - 1, source, spare, target, moves)
    moves.append([source, target])
    move(n - 1, spare, target, source, moves)


def hanoi(n):
    moves = []
    move(n, "A", "C", "B", moves)
    return moves
