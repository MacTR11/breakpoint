--- meta
{"title": "Serving the queue", "kind": "CODE", "difficulty": "EASY", "topic": "Queues", "points": 10, "track": "structures", "specRef": "1.4.2", "functionName": "served",
  "tests": [
    {"args": [["join Ada", "join Ben", "serve", "join Cy", "serve", "serve", "serve"]], "expected": ["Ada", "Ben", "Cy"]},
    {"args": [[]], "expected": []},
    {"args": [["serve"]], "expected": []},
    {"args": [["join A", "join B"]], "expected": [], "hidden": true},
    {"args": [["join X", "serve", "join Y", "serve", "join Z"]], "expected": ["X", "Y"], "hidden": true}
  ]
}
--- description
A café queue is described by a list of commands. `"join NAME"` puts someone at the back of the queue, and `"serve"` serves whoever is at the front. Serving an empty queue does nothing.

Write the function `served(commands)`, which returns a list of the names in the order they were served.

For example, `served(["join Ada", "join Ben", "serve", "join Cy", "serve", "serve", "serve"])` returns `["Ada", "Ben", "Cy"]`.
--- hints
- Use a list as the queue: append to the back, and take from the front with `queue.pop(0)`.
- The name is everything after `"join "`: `command[5:]`.
--- starter
def served(commands):
    pass
--- solution
def served(commands):
    queue = []
    order = []
    for command in commands:
        if command.startswith("join "):
            queue.append(command[5:])
        elif command == "serve" and len(queue) > 0:
            order.append(queue.pop(0))
    return order
