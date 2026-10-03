--- meta
{"title": "Sports day (b): the winning house", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Records and dictionaries", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "winning_house",
  "tests": [
    {"args": [["Ada,Red,100m,8", "Ben,Blue,100m,6", "Cy,Red,Long jump,5", "Di,Green,100m,4", "Ed,Blue,Relay,9"]], "expected": "Blue"},
    {"args": [["Fi,Green,Shot,7"]], "expected": "Green"},
    {"args": [["A,Red,x,5", "B,Blue,x,5", "C,Green,x,3", "D,Red,x,1", "E,Blue,x,1"]], "expected": "Blue"},
    {"args": [["A,Yellow,x,2", "B,Green,x,2"]], "expected": "Green", "hidden": true},
    {"args": [["A,Red,x,3", "B,Blue,x,4", "C,Red,x,2"]], "expected": "Red", "hidden": true}
  ]
}
--- description
A college records its sports day results as a list of strings called `results`. Each string holds a competitor's name, their house, the event and the points they earned for their house, separated by commas, for example `"Ada,Red,100m,8"`.

Write the function `winning_house(results)`, which returns the name of the house with the most points. If two or more houses are level at the top, it returns whichever of them comes first in alphabetical order. There is always at least one result.

You may use your function `house_totals` from part (a); if you do, include it in your answer.

**[5 marks]**
--- hints
- Work out every house's total first (part (a) does this).
- Then look through the houses for the best. A house beats the best so far if it has more points, or the same points and a name earlier in the alphabet.
--- starter
def winning_house(results):
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

def winning_house(results):
    totals = house_totals(results)
    best = None
    for house in totals:
        if best is None or totals[house] > totals[best] or (totals[house] == totals[best] and house < best):
            best = house
    return best
--- explanation
One mark each, up to 5:

- Finds the total for every house (for example by calling part (a)).
- Keeps track of the best house found so far.
- Compares totals to find the largest.
- Breaks a tie in favour of the house that is first alphabetically.
- Returns the house's name, not its total.
