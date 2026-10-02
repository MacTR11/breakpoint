--- meta
{"title": "Results file (c): validate a line", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "valid_line",
  "tests": [
    {"args": ["Ada,12A,71"], "expected": true},
    {"args": ["Ada,12A"], "expected": false},
    {"args": ["Ada,12A,101"], "expected": false},
    {"args": ["Ada,12A,seventy"], "expected": false},
    {"args": [",12A,50"], "expected": false, "hidden": true},
    {"args": ["Ada,12A,0"], "expected": true, "hidden": true},
    {"args": ["Ada,12A,100"], "expected": true, "hidden": true},
    {"args": ["Ada,12A,71,extra"], "expected": false, "hidden": true},
    {"args": ["Ada,,71"], "expected": false, "hidden": true},
    {"args": ["Ada,12A,-5"], "expected": false, "hidden": true},
    {"args": [""], "expected": false, "hidden": true},
    {"args": ["Ada,12A,7.5"], "expected": false, "hidden": true}
  ]
}
--- description
A teacher keeps test results in a text file. The file has been read into a list of strings called `lines`, one string for each line of the file. Each line holds a student's name, their class and their score out of 100, separated by commas, for example `"Ada,12A,71"`.

Before a line is used it must be validated. Write the function `valid_line(line)`, which returns `True` only if all of these are true:

- the line has exactly three fields, separated by commas
- the name is not empty
- the class is not empty
- the score is made up only of digits
- the score is between 0 and 100 inclusive.

Otherwise it returns `False`. The function must never crash, whatever string it is given.

**[6 marks]**
--- hints
- Split the line, then check the number of fields first. If there are not exactly 3, return `False` before touching `fields[2]`.
- `text.isdigit()` is `True` only when the string is one or more digits, so it rejects `""`, `"-5"`, `"7.5"` and `"seventy"`. Only call `int()` once that check has passed.
--- starter
def valid_line(line):
    pass
--- solution
def valid_line(line):
    fields = line.split(",")
    if len(fields) != 3:
        return False
    if fields[0] == "" or fields[1] == "":
        return False
    if not fields[2].isdigit():
        return False
    score = int(fields[2])
    return score >= 0 and score <= 100
--- explanation
One mark each, up to 6:

- Splits the line at the commas.
- Rejects a line that does not have exactly three fields, before using the fields.
- Rejects an empty name or an empty class.
- Checks the score is all digits before converting it.
- Checks the range 0 to 100, including both ends.
- Returns `True` only when every check has passed, and `False` in every other case.
