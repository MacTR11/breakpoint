--- meta
{"contest": "upper-sixth-challenge", "title": "Rooms on a floor plan", "kind": "CODE", "difficulty": "HARD", "topic": "Graph traversal", "points": 50, "track": "algorithms", "specRef": "2.3.1", "functionName": "count_rooms",
  "tests": [
    {"args": [["#######", "#..#..#", "#..#..#", "#######"]], "expected": 2},
    {"args": [["#.#", ".#.", "#.#"]], "expected": 4},
    {"args": [["####"]], "expected": 0},
    {"args": [[]], "expected": 0, "hidden": true},
    {"args": [["#....#", "#.##.#", "#....#"]], "expected": 1, "hidden": true},
    {"args": [["."]], "expected": 1, "hidden": true},
    {"args": [["..#..#..", "########", "..#....#"]], "expected": 5, "hidden": true}
  ]
}
--- description
A floor plan is drawn as a list of strings of the same length: `"#"` is wall and `"."` is floor. Two floor squares are in the same room if you can walk from one to the other moving up, down, left or right over floor (never diagonally, and never through walls).

Write `count_rooms(plan)`, which returns how many separate rooms there are. A plan with no floor, or no rows at all, has none.

```
#######
#..#..#
#..#..#
#######
```

This plan has 2 rooms.
--- hints
- Go through every square. When you find floor you have not visited yet, that is a new room: count it, then visit every floor square joined to it.
- To visit a whole room, keep a list of squares to explore. Take one off, and add each neighbour that is floor, inside the plan and not yet visited.
--- starter
def count_rooms(plan):
    # Write your code here
    pass
--- solution
def count_rooms(plan):
    rows = len(plan)
    cols = len(plan[0]) if rows > 0 else 0
    visited = [[False] * cols for _ in range(rows)]
    rooms = 0
    for r in range(rows):
        for c in range(cols):
            if plan[r][c] == "." and not visited[r][c]:
                rooms = rooms + 1
                visited[r][c] = True
                to_explore = [(r, c)]
                while len(to_explore) > 0:
                    y, x = to_explore.pop()
                    for dy, dx in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < rows and 0 <= nx < cols and plan[ny][nx] == "." and not visited[ny][nx]:
                            visited[ny][nx] = True
                            to_explore.append((ny, nx))
    return rooms
