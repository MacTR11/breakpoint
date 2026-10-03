--- meta
{"title": "Quiz app (a): read a question", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 15, "track": "exam", "specRef": "2.2.1", "functionName": "parse_question",
  "tests": [
    {"args": ["What is 2 ** 5?|32|1"], "expected": ["What is 2 ** 5?", "32", 1]},
    {"args": ["Q|A|10"], "expected": ["Q", "A", 10]},
    {"args": ["Best sort?|merge sort|3"], "expected": ["Best sort?", "merge sort", 3]},
    {"args": ["Spaces?| yes |2"], "expected": ["Spaces?", "yes", 2], "hidden": true}
  ]
}
--- description
A revision quiz app stores its questions in a text file, one question per line. Each line holds the question, the correct answer and the points it is worth, separated by `|` characters, for example `"What does CPU stand for?|central processing unit|2"`.

Write the function `parse_question(line)`, which returns a list of three things: the question, the answer and the points as an integer. The answer has any spaces at either end removed.

For example, `parse_question("What is 2 ** 5?|32|1")` returns `["What is 2 ** 5?", "32", 1]`.

**[3 marks]**
--- hints
- `line.split("|")` gives the three parts.
- Use `.strip()` on the answer and `int()` on the points.
--- starter
def parse_question(line):
    pass
--- solution
def parse_question(line):
    parts = line.split("|")
    return [parts[0], parts[1].strip(), int(parts[2])]
--- explanation
One mark each, up to 3:

- Splits the line at the `|` characters.
- Removes spaces from the ends of the answer.
- Converts the points to an integer and returns the three items in order.
