--- meta
{"title": "Sorting (c): insertion sort on names", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Insertion sort", "points": 20, "track": "exam", "specRef": "2.3.1", "functionName": "insertion_names", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [["Mo", "Ada", "Zed", "Ben"]], "expected": ["Ada", "Ben", "Mo", "Zed"]},
    {"args": [["Kit"]], "expected": ["Kit"]},
    {"args": [[]], "expected": []},
    {"args": [["b", "a", "c", "a"]], "expected": ["a", "a", "b", "c"], "hidden": true},
    {"args": [["Zo", "Yan", "Xi", "Wes", "Val"]], "expected": ["Val", "Wes", "Xi", "Yan", "Zo"], "hidden": true},
    {"args": [["Ann", "Ben", "Cy"]], "expected": ["Ann", "Ben", "Cy"], "hidden": true},
    {"args": [["Tom", "Tim", "Tam", "Tem"]], "expected": ["Tam", "Tem", "Tim", "Tom"], "hidden": true}
  ]
}
--- description
A register needs a list of names sorted into alphabetical order.

Write the function `insertion_names(names)`, which uses an **insertion sort** to sort the list into ascending order and returns it.

Write the algorithm yourself: do not use `sorted` or `sort`. All the names start with a capital letter, so they can be compared directly with `<` and `>`.

For example, `insertion_names(["Mo", "Ada", "Zed", "Ben"])` returns `["Ada", "Ben", "Mo", "Zed"]`.

**[6 marks]**
--- hints
- Take each name in turn, starting from index 1. Everything to its left is already sorted.
- Hold the name in a variable. While the name to the left is greater, shuffle that name one place right and step left. Then drop the held name into the gap.
- The inner loop needs two conditions: `position > 0 and names[position - 1] > current`.
--- starter
def insertion_names(names):
    pass
--- solution
def insertion_names(names):
    for index in range(1, len(names)):
        current = names[index]
        position = index
        while position > 0 and names[position - 1] > current:
            names[position] = names[position - 1]
            position = position - 1
        names[position] = current
    return names
--- explanation
One mark each, up to 6:

- An outer loop from the second element to the end.
- The current element is copied into a variable.
- An inner loop that moves left through the sorted part.
- The inner loop stops at the start of the list, and when it meets an element that is not greater.
- Larger elements are moved one place to the right.
- The stored element is placed in the gap, and the list is returned.
