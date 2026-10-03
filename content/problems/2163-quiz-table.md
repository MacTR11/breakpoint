--- meta
{"title": "Quiz app (c): the results table", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting records", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "results_table",
  "tests": [
    {"args": [{"Ada": 5, "Ben": 6, "Cy": 5}], "expected": ["Ben: 6", "Ada: 5", "Cy: 5"]},
    {"args": [{}], "expected": []},
    {"args": [{"Solo": 0}], "expected": ["Solo: 0"]},
    {"args": [{"b": 3, "a": 3, "c": 3}], "expected": ["a: 3", "b: 3", "c: 3"], "hidden": true},
    {"args": [{"Mo": 10, "Li": 2, "Jo": 7, "Al": 10}], "expected": ["Al: 10", "Mo: 10", "Jo: 7", "Li: 2"], "hidden": true}
  ]
}
--- description
A revision quiz app stores its questions in a text file, one question per line. Each line holds the question, the correct answer and the points it is worth, separated by `|` characters, for example `"What does CPU stand for?|central processing unit|2"`.

At the end of a quiz the scores are kept in a dictionary from each student's name to their total. Write the function `results_table(scores)`, which returns a list of strings like `"Ben: 6"`, highest score first. Students with the same score are listed in alphabetical order.

For example, `results_table({"Ada": 5, "Ben": 6, "Cy": 5})` returns `["Ben: 6", "Ada: 5", "Cy: 5"]`.

**[6 marks]**
--- hints
- Make a list of `[score, name]` pairs. Sorting them with `sorted()` would put the lowest score first, so sort by the negative score, then the name.
- `sorted(pairs, key=lambda pair: (-pair[0], pair[1]))` orders by score (highest first) and then name. Then build the strings.
--- starter
def results_table(scores):
    pass
--- solution
def results_table(scores):
    pairs = []
    for name in scores:
        pairs.append([scores[name], name])
    pairs = sorted(pairs, key=lambda pair: (-pair[0], pair[1]))
    table = []
    for points, name in pairs:
        table.append(name + ": " + str(points))
    return table
--- explanation
One mark each, up to 6:

- Gets every name and score out of the dictionary.
- Orders by score, highest first.
- Breaks a tie in alphabetical order of name.
- Builds each line as name, colon, space, score.
- Converts the score to a string when building the line.
- Returns the lines as a list, in order.
