--- meta
{"title": "Sports day (a): points for each house", "kind": "CODE", "difficulty": "EASY", "topic": "Records and dictionaries", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "house_totals",
  "tests": [
    {"args": [["Ada,Red,100m,8", "Ben,Blue,100m,6", "Cy,Red,Long jump,5", "Di,Green,100m,4", "Ed,Blue,Relay,9"]], "expected": {"Red": 13, "Blue": 15, "Green": 4}},
    {"args": [["Fi,Green,Shot,7"]], "expected": {"Green": 7}},
    {"args": [[]], "expected": {}},
    {"args": [["A,Red,x,5", "B,Blue,x,5", "C,Green,x,3", "D,Red,x,1", "E,Blue,x,1"]], "expected": {"Red": 6, "Blue": 6, "Green": 3}, "hidden": true},
    {"args": [["A,Red,x,0", "B,Red,y,0"]], "expected": {"Red": 0}, "hidden": true}
  ]
}
--- description
A college records its sports day results as a list of strings called `results`. Each string holds a competitor's name, their house, the event and the points they earned for their house, separated by commas, for example `"Ada,Red,100m,8"`.

Write the function `house_totals(results)`, which returns a dictionary from each house to its total points.

For the example lines `"Ada,Red,100m,8"`, `"Ben,Blue,100m,6"` and `"Cy,Red,Long jump,5"`, it would return `{"Red": 13, "Blue": 6}`.

**[5 marks]**
--- hints
- Split each line at the commas. The house is at index 1 and the points, as a string, at index 3.
- Start a house at 0 the first time you see it, then add the points to it.
--- starter
def house_totals(results):
    pass
--- solution
def house_totals(results):
    totals = {}
    for line in results:
        fields = line.split(",")
        house = fields[1]
        if house not in totals:
            totals[house] = 0
        totals[house] = totals[house] + int(fields[3])
    return totals
--- explanation
One mark each, up to 5:

- Loops through every result.
- Splits each line and takes the house and the points from the right fields.
- Converts the points to an integer.
- Handles a house that has not been seen yet.
- Adds to the right house's total and returns the dictionary.
