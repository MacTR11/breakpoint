--- meta
{"title": "Fix: syntax errors", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Syntax errors", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "grade",
  "tests": [
    {"args": [85], "expected": "Distinction"},
    {"args": [55], "expected": "Pass"},
    {"args": [20], "expected": "Fail"},
    {"args": [70], "expected": "Distinction", "hidden": true},
    {"args": [40], "expected": "Pass", "hidden": true},
    {"args": [39], "expected": "Fail", "hidden": true},
    {"args": [69], "expected": "Pass", "hidden": true}
  ]
}
--- description
`grade(mark)` should return `"Distinction"` for a mark of 70 or more, `"Pass"` for 40 or more, and `"Fail"` otherwise.

The logic is right, but there are **three syntax errors**, so Python cannot run it at all. Python reports them one at a time: fix one, run again, and it will show you the next.
--- hints
- A syntax error message gives a line number and points at where Python got confused. The mistake is on that line or just before it.
- Two lines are missing the same punctuation mark at the end, and one keyword is misspelt.
--- starter
def grade(mark)
    if mark >= 70:
        return "Distinction"
    elif mark >= 40
        return "Pass"
    else:
        retrun "Fail"
--- solution
def grade(mark):
    if mark >= 70:
        return "Distinction"
    elif mark >= 40:
        return "Pass"
    else:
        return "Fail"
