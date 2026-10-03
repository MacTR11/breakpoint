--- meta
{"title": "Election (b): count the first choices", "kind": "CODE", "difficulty": "EASY", "topic": "Dictionaries", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "first_choices",
  "tests": [
    {"args": [[["Ada", "Cy"], ["Ben"], ["Cy", "Ada"], ["Ada"], ["Ben", "Ada"], [], ["Ada", "Ada"]], ["Ada", "Ben", "Cy"]], "expected": {"Ada": 2, "Ben": 2, "Cy": 1}},
    {"args": [[], ["Ada", "Ben", "Cy"]], "expected": {"Ada": 0, "Ben": 0, "Cy": 0}},
    {"args": [[["Cy"], ["Cy"], ["Dee"]], ["Ada", "Ben", "Cy"]], "expected": {"Ada": 0, "Ben": 0, "Cy": 2}},
    {"args": [[["Ben", "Ada"], ["Ben"]], ["Ada", "Ben"]], "expected": {"Ada": 0, "Ben": 2}, "hidden": true}
  ]
}
--- description
The student council election uses ranked ballots. Each ballot is a list of candidates' names in the voter's order of preference, first choice first, for example `["Ada", "Cy", "Ben"]`. A voter does not have to rank every candidate. The list `candidates` holds every candidate's name.

Write the function `first_choices(ballots, candidates)`, which returns a dictionary from every candidate to the number of valid ballots that put them first. A candidate with no first choices still appears, with 0. Invalid ballots (see part (a)) are ignored.

You may use your function from part (a); if you do, include it in your answer.

**[4 marks]**
--- hints
- Start the dictionary with every candidate at 0, so that nobody is missing.
- For each valid ballot, add 1 to the count for `ballot[0]`.
--- starter
def first_choices(ballots, candidates):
    pass
--- solution
def valid_ballot(ballot, candidates):
    if len(ballot) == 0:
        return False
    seen = []
    for name in ballot:
        if name not in candidates or name in seen:
            return False
        seen.append(name)
    return True

def first_choices(ballots, candidates):
    counts = {}
    for name in candidates:
        counts[name] = 0
    for ballot in ballots:
        if valid_ballot(ballot, candidates):
            counts[ballot[0]] = counts[ballot[0]] + 1
    return counts
--- explanation
One mark each, up to 4:

- Starts every candidate at 0.
- Ignores invalid ballots.
- Adds one to the first-choice candidate of each valid ballot.
- Returns the dictionary of counts.
