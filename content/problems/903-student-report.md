--- meta
{
  "title": "Marks Report", "kind": "CODE", "difficulty": "HARD", "topic": "Robust file processing", "points": 40, "track": "robust", "specRef": "3.3", "contest": "build-it-right",
  "functionName": "student_report",
  "tests": [
    { "args": [["Ava,70,80", "Ben,50"]], "expected": { "Ava": 75.0, "Ben": 50.0 } },
    { "args": [["Cal,abc,60,101"]], "expected": { "Cal": 60.0 } },
    { "args": [["Dee"]], "expected": {} },
    { "args": [[]], "expected": {}, "hidden": true },
    { "args": [["Eli,100,0,50"]], "expected": { "Eli": 50.0 }, "hidden": true },
    { "args": [["Fay, 90 ,80"]], "expected": { "Fay": 85.0 }, "hidden": true },
    { "args": [["Gus,-5,x"]], "expected": {}, "hidden": true },
    { "args": [["Hal,66,67,67"]], "expected": { "Hal": 66.7 }, "hidden": true },
    { "args": [["Ivy,1,2", " Jay ,,40,", "Kit,12.5"]], "expected": { "Ivy": 1.5, "Jay": 40.0 }, "hidden": true }
  ]
}
--- description
A teacher exports marks to a text file. Each line is a student's name followed by any number of marks, separated by commas:

```
Ava,70,80
Ben,50
```

The file was typed by hand, so some of it is wrong. Your code must produce a sensible report anyway.

Write a function `student_report(lines)` that returns a dictionary mapping each student's name to their **average mark, rounded to 1 decimal place**.

- A mark is valid only if it is a whole number from 0 to 100 inclusive. Ignore any other mark (text, decimals, out of range, or empty).
- Ignore spaces around names and marks.
- A student with no valid marks is left out of the report altogether.
- No name appears on more than one line.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `student_report(["Ava,70,80", "Ben,50"])` | `{"Ava": 75.0, "Ben": 50.0}` | |
| `student_report(["Cal,abc,60,101"])` | `{"Cal": 60.0}` | `abc` and `101` are ignored |
| `student_report(["Dee"])` | `{}` | no valid marks |

### Note

`round(66.666, 1)` gives `66.7`.
--- hints
- Split each line on commas. The first field is the name; loop over the rest as marks.
- Use `try` / `except ValueError` around `int(field.strip())`, then check the mark is from 0 to 100. Only add the student if their list of valid marks is not empty.
--- starter
def student_report(lines):
    # Write your code here
    pass
--- solution
def student_report(lines):
    report = {}
    for line in lines:
        fields = line.split(",")
        name = fields[0].strip()
        marks = []
        for field in fields[1:]:
            try:
                mark = int(field.strip())
            except ValueError:
                continue
            if 0 <= mark <= 100:
                marks.append(mark)
        if name and marks:
            report[name] = round(sum(marks) / len(marks), 1)
    return report
