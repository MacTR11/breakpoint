--- meta
{"title": "Quiz app (b): mark the answers", "kind": "CODE", "difficulty": "MEDIUM", "topic": "String handling", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "score",
  "tests": [
    {"args": [["What is 2 ** 5?|32|1", "What does CPU stand for?|central processing unit|2", "Name the sort that splits a list in half|merge sort|3"], ["32", "Central Processing Unit", "bubble sort"]], "expected": 3},
    {"args": [["What is 2 ** 5?|32|1", "What does CPU stand for?|central processing unit|2", "Name the sort that splits a list in half|merge sort|3"], ["32", " central processing unit ", "MERGE SORT"]], "expected": 6},
    {"args": [["What is 2 ** 5?|32|1", "What does CPU stand for?|central processing unit|2", "Name the sort that splits a list in half|merge sort|3"], ["", "", ""]], "expected": 0},
    {"args": [[], []], "expected": 0, "hidden": true},
    {"args": [["What is 2 ** 5?|32|1", "What does CPU stand for?|central processing unit|2", "Name the sort that splits a list in half|merge sort|3"], ["33", "central processing unit", "merge sort"]], "expected": 5, "hidden": true}
  ]
}
--- description
A revision quiz app stores its questions in a text file, one question per line. Each line holds the question, the correct answer and the points it is worth, separated by `|` characters, for example `"What does CPU stand for?|central processing unit|2"`.

A student's answers are a list of strings, in the same order as the questions. Write the function `score(lines, answers)`, which returns the student's total points. An answer is correct if it matches the correct answer when upper and lower case are ignored and spaces at either end are removed.

You may use your function from part (a); if you do, include it in your answer.

**[5 marks]**
--- hints
- Loop over the indexes of the questions, so you can look at `lines[i]` and `answers[i]` together.
- Compare `answers[i].strip().lower()` with the correct answer in lower case. Add the question's points when they match.
--- starter
def score(lines, answers):
    pass
--- solution
def parse_question(line):
    parts = line.split("|")
    return [parts[0], parts[1].strip(), int(parts[2])]

def score(lines, answers):
    total = 0
    for i in range(len(lines)):
        question, answer, points = parse_question(lines[i])
        if answers[i].strip().lower() == answer.lower():
            total = total + points
    return total
--- explanation
One mark each, up to 5:

- Pairs each question with the student's answer in the same position.
- Gets the correct answer and the points from each line.
- Removes spaces from the ends of the student's answer.
- Ignores case when comparing.
- Adds the points for each correct answer and returns the total.
