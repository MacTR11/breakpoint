--- meta
{"title": "Say hello", "kind": "CODE", "difficulty": "EASY", "topic": "Strings", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "greet",
  "tests": [
    {"args": ["Ada"], "expected": "Hello, Ada!"},
    {"args": ["Mo"], "expected": "Hello, Mo!"},
    {"args": ["world"], "expected": "Hello, world!"},
    {"args": ["Blackpool"], "expected": "Hello, Blackpool!", "hidden": true},
    {"args": [""], "expected": "Hello, !", "hidden": true},
    {"args": ["Grace Hopper"], "expected": "Hello, Grace Hopper!", "hidden": true}
  ]
}
--- description
Your first function. `greet(name)` should return a greeting for that name.

For example, `greet("Ada")` returns `"Hello, Ada!"`.

The editor already has the first line. Change the line underneath so that it returns the right string, then press **Run examples**.
--- hints
- Strings are joined with `+`. You need three pieces: `"Hello, "`, then `name`, then `"!"`.
- The whole function is `return "Hello, " + name + "!"`. Mind the space after the comma.
--- starter
def greet(name):
    return "Hello"
--- solution
def greet(name):
    return "Hello, " + name + "!"
