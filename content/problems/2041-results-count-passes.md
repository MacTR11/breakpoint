--- meta
{"title": "Results file (a): count the passes", "kind": "CODE", "difficulty": "EASY", "topic": "String handling and files", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "count_passes",
  "tests": [
    {"args": [["Ada,12A,71", "Ben,12B,39", "Cy,12A,40", "Di,12B,90"], 40], "expected": 3},
    {"args": [["Eve,13X,100"], 50], "expected": 1},
    {"args": [["Flo,12A,0", "Gus,12A,55", "Hal,12C,54", "Ivy,12C,56", "Jo,12A,70", "Kai,12B,12"], 55], "expected": 3},
    {"args": [[], 40], "expected": 0, "hidden": true},
    {"args": [["Flo,12A,0", "Gus,12A,55", "Hal,12C,54", "Ivy,12C,56", "Jo,12A,70", "Kai,12B,12"], 0], "expected": 6, "hidden": true},
    {"args": [["Ada,12A,71", "Ben,12B,39", "Cy,12A,40", "Di,12B,90"], 91], "expected": 0, "hidden": true},
    {"args": [["Flo,12A,0", "Gus,12A,55", "Hal,12C,54", "Ivy,12C,56", "Jo,12A,70", "Kai,12B,12"], 56], "expected": 2, "hidden": true}
  ]
}
--- description
A teacher keeps test results in a text file. The file has been read into a list of strings called `lines`, one string for each line of the file. Each line holds a student's name, their class and their score out of 100, separated by commas, for example `"Ada,12A,71"`.

Write the function `count_passes(lines, pass_mark)`, which returns the number of students whose score is greater than or equal to `pass_mark`.

**[4 marks]**
--- hints
- `line.split(",")` turns `"Ada,12A,71"` into the list `["Ada", "12A", "71"]`. The score is the item at index 2.
- The score is still a string at that point. Convert it with `int(...)` before comparing it with the pass mark.
--- starter
def count_passes(lines, pass_mark):
    pass
--- solution
def count_passes(lines, pass_mark):
    passes = 0
    for line in lines:
        fields = line.split(",")
        if int(fields[2]) >= pass_mark:
            passes = passes + 1
    return passes
--- explanation
One mark each, up to 4:

- Loops through every line.
- Splits each line at the commas and takes the third field.
- Converts the score to an integer and compares it with the pass mark using `>=`.
- Counts the passes and returns the count.
