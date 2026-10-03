--- meta
{
  "title": "Escape the maze",
  "kind": "CODE",
  "difficulty": "HARD",
  "topic": "Graphs",
  "points": 50,
  "track": "algorithms", "specRef": "2.3.1",
  "functionName": "shortest_path",
  "tests": [
    { "args": [["S.E"]], "expected": 2 },
    { "args": [["S#E"]], "expected": -1 },
    { "args": [["S..", ".#.", "..E"]], "expected": 4 },
    { "args": [["S#.", ".#E", "..."]], "expected": 5, "hidden": true },
    { "args": [["SE"]], "expected": 1, "hidden": true },
    { "args": [["S.#", "##.", "..E"]], "expected": -1, "hidden": true },
    { "args": [["S....", "####.", "E...."]], "expected": 10, "hidden": true },
    { "args": [["....", ".S#E", "...."]], "expected": 4, "hidden": true }
  ]
}
--- description
A maze is given as a list of strings, one string per row. Each character is one square:

- `S` is where you start
- `E` is the exit
- `#` is a wall
- `.` is open floor

You can move one square at a time **up, down, left or right** (not diagonally), and cannot walk through walls or leave the grid.

Write a function `shortest_path(maze)` that returns the **smallest number of moves** needed to get from `S` to `E`, or `-1` if the exit cannot be reached.

### Example

```
S..
.#.
..E
```

`shortest_path(["S..", ".#.", "..E"])` returns `4`.

`shortest_path(["S#E"])` returns `-1`, because the wall blocks the only route.
--- hints
- Use a breadth-first search: a queue of squares to visit, each stored with its distance from the start.
- Take a square from the front of the queue; if it is `E` return its distance. Otherwise add its four neighbours to the back, skipping walls, squares off the grid and squares already seen.
--- starter
def shortest_path(maze):
    # Write your code here
    pass
--- solution
from collections import deque

def shortest_path(maze):
    rows, cols = len(maze), len(maze[0])
    for r in range(rows):
        for c in range(cols):
            if maze[r][c] == "S":
                start = (r, c)
    queue = deque([(start, 0)])
    seen = {start}
    while queue:
        (r, c), dist = queue.popleft()
        if maze[r][c] == "E":
            return dist
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and maze[nr][nc] != "#" and (nr, nc) not in seen:
                seen.add((nr, nc))
                queue.append(((nr, nc), dist + 1))
    return -1
