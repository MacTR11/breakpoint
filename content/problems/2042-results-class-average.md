--- meta
{"title": "Results file (b): the mean score for each class", "kind": "CODE", "difficulty": "HARD", "topic": "String handling and dictionaries", "points": 40, "track": "exam", "specRef": "2.2.1", "functionName": "class_means",
  "tests": [
    {"args": [["Ada,12A,71", "Ben,12B,39", "Cy,12A,40", "Di,12B,90"]], "expected": {"12A": 55.5, "12B": 64.5}},
    {"args": [["Eve,13X,100"]], "expected": {"13X": 100.0}},
    {"args": [["Flo,12A,0", "Gus,12A,55", "Hal,12C,54", "Ivy,12C,56", "Jo,12A,70", "Kai,12B,12"]], "expected": {"12A": 41.7, "12C": 55.0, "12B": 12.0}},
    {"args": [[]], "expected": {}, "hidden": true},
    {"args": [["A,x,1", "B,x,2", "C,x,2"]], "expected": {"x": 1.7}, "hidden": true},
    {"args": [["A,p,10", "B,q,20", "C,p,15", "D,r,0", "E,q,21"]], "expected": {"p": 12.5, "q": 20.5, "r": 0.0}, "hidden": true}
  ]
}
--- description
A teacher keeps test results in a text file. The file has been read into a list of strings called `lines`, one string for each line of the file. Each line holds a student's name, their class and their score out of 100, separated by commas, for example `"Ada,12A,71"`.

Write the function `class_means(lines)`, which returns a dictionary. Each key is the name of a class, and its value is the mean score of the students in that class, rounded to 1 decimal place.

For example, for the lines `"Ada,12A,71"`, `"Ben,12B,39"`, `"Cy,12A,40"` and `"Di,12B,90"` it returns `{"12A": 55.5, "12B": 64.5}`.

An empty list of lines gives an empty dictionary.

**[7 marks]**
--- hints
- You cannot work out a mean until you have seen every line, so keep two dictionaries while you loop: the total score for each class, and the number of students in each class.
- The first time you meet a class it will not be in the dictionaries yet. Check with `if group not in totals:` and start it at 0.
- After the loop, build the answer: for each class, `round(totals[group] / counts[group], 1)`.
--- starter
def class_means(lines):
    pass
--- solution
def class_means(lines):
    totals = {}
    counts = {}
    for line in lines:
        fields = line.split(",")
        group = fields[1]
        if group not in totals:
            totals[group] = 0
            counts[group] = 0
        totals[group] = totals[group] + int(fields[2])
        counts[group] = counts[group] + 1
    means = {}
    for group in totals:
        means[group] = round(totals[group] / counts[group], 1)
    return means
--- explanation
One mark each, up to 7:

- Loops through every line and splits it into its fields.
- Takes the class from the second field and the score, as an integer, from the third.
- Keeps a running total for each class.
- Keeps a count of students for each class.
- Handles a class that has not been seen before.
- Divides each total by its count and rounds to 1 decimal place.
- Returns a dictionary from class name to mean.
