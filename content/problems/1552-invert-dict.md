--- meta
{"title": "Who has what?", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Dictionaries", "points": 25, "track": "lists", "specRef": "2.2.1", "functionName": "invert",
  "tests": [
    {"args": [{"Ada": "red", "Ben": "blue", "Cy": "red"}], "expected": {"red": ["Ada", "Cy"], "blue": ["Ben"]}},
    {"args": [{}], "expected": {}},
    {"args": [{"x": 1}], "expected": {"1": ["x"]}},
    {"args": [{"b": "k", "a": "k", "c": "k"}], "expected": {"k": ["a", "b", "c"]}, "hidden": true},
    {"args": [{"Mo": "13A", "Li": "12B", "Jo": "13A", "Al": "12B"}], "expected": {"13A": ["Jo", "Mo"], "12B": ["Al", "Li"]}, "hidden": true}
  ]
}
--- description
A dictionary maps each student's name to their house colour. Write the function `invert(houses)`, which returns a new dictionary mapping each house colour to a list of the students in it, with the names in alphabetical order.

For example, `invert({"Ada": "red", "Ben": "blue", "Cy": "red"})` returns `{"red": ["Ada", "Cy"], "blue": ["Ben"]}`.
--- hints
- Go through `houses.items()`. For each name and colour, start an empty list for the colour if it is new, then append the name.
- Sort each list at the end, with `sorted()` or `.sort()`.
--- starter
def invert(houses):
    pass
--- solution
def invert(houses):
    result = {}
    for name, colour in houses.items():
        if colour not in result:
            result[colour] = []
        result[colour].append(name)
    for colour in result:
        result[colour].sort()
    return result
