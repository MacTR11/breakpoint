--- meta
{"title": "Student Record", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Encapsulation", "points": 20, "track": "oop", "specRef": "1.2.4", "functionName": "Student",
  "tests": [
    {"steps": [["Student", "Ada"], ["add_mark", 80], ["add_mark", 60], ["average"], ["grade"]], "expected": [true, true, 70.0, "Distinction"]},
    {"steps": [["Student", "Bo"], ["average"], ["grade"], ["add_mark", 101]], "expected": [0, "No marks", false]},
    {"steps": [["Student", "Cy"], ["add_mark", -1], ["add_mark", 40], ["average"], ["grade"]], "expected": [false, true, 40.0, "Pass"]},
    {"steps": [["Student", "Di"], ["add_mark", 0], ["add_mark", 39], ["grade"], ["add_mark", 100], ["average"], ["grade"]], "expected": [true, true, "Fail", true, 46.3333333333, "Pass"], "hidden": true},
    {"steps": [["Student", "Ed"], ["add_mark", 100], ["add_mark", 39], ["add_mark", 70], ["get_name"], ["grade"]], "expected": [true, true, true, "Ed", "Pass"], "hidden": true}
  ]
}
--- description
Write a class `Student`, created with the student's name: `Student("Ada")`.

| Method | What it does |
| --- | --- |
| `get_name()` | Returns the student's name. |
| `add_mark(mark)` | Records a mark and returns `True`. A mark outside 0 to 100 is not recorded, and returns `False`. |
| `average()` | Returns the mean of the recorded marks, or `0` if there are none. |
| `grade()` | Returns `"Distinction"` for an average of 70 or more, `"Pass"` for 40 or more, `"Fail"` below that, and `"No marks"` if nothing has been recorded. |

### Example

```python
student = Student("Ada")
student.add_mark(80)     # True
student.add_mark(60)     # True
student.add_mark(140)    # False: not recorded
student.average()        # 70.0
student.grade()          # "Distinction"
```
--- hints
- Keep the marks in a list attribute, set up as an empty list in `__init__`.
- `grade` can call `self.average()` rather than working it out again. Check for no marks first.
--- starter
class Student:
    def __init__(self, name):
        # Store the attributes here
        pass

    def get_name(self):
        pass

    def add_mark(self, mark):
        pass

    def average(self):
        pass

    def grade(self):
        pass
--- solution
class Student:
    def __init__(self, name):
        self.name = name
        self.marks = []

    def get_name(self):
        return self.name

    def add_mark(self, mark):
        if mark < 0 or mark > 100:
            return False
        self.marks.append(mark)
        return True

    def average(self):
        if len(self.marks) == 0:
            return 0
        return sum(self.marks) / len(self.marks)

    def grade(self):
        if len(self.marks) == 0:
            return "No marks"
        if self.average() >= 70:
            return "Distinction"
        if self.average() >= 40:
            return "Pass"
        return "Fail"
