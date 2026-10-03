--- meta
{"title": "Election (a): check a ballot", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "valid_ballot",
  "tests": [
    {"args": [["Ada", "Cy"], ["Ada", "Ben", "Cy"]], "expected": true},
    {"args": [[], ["Ada", "Ben", "Cy"]], "expected": false},
    {"args": [["Ada", "Ada"], ["Ada", "Ben", "Cy"]], "expected": false},
    {"args": [["Dee"], ["Ada", "Ben", "Cy"]], "expected": false, "hidden": true},
    {"args": [["Cy", "Ben", "Ada"], ["Ada", "Ben", "Cy"]], "expected": true, "hidden": true},
    {"args": [["ada"], ["Ada", "Ben", "Cy"]], "expected": false, "hidden": true},
    {"args": [["Ben", "Cy", "Ben"], ["Ada", "Ben", "Cy"]], "expected": false, "hidden": true}
  ]
}
--- description
The student council election uses ranked ballots. Each ballot is a list of candidates' names in the voter's order of preference, first choice first, for example `["Ada", "Cy", "Ben"]`. A voter does not have to rank every candidate. The list `candidates` holds every candidate's name.

Write the function `valid_ballot(ballot, candidates)`, which returns `True` only if the ballot ranks at least one candidate, names only people in `candidates` (with exactly the same spelling and capitals), and names nobody more than once. Otherwise it returns `False`.

**[5 marks]**
--- hints
- An empty ballot is the first thing to rule out.
- Go through the ballot, keeping a list of names already seen. A name that is not a candidate, or that has been seen already, makes the ballot invalid.
--- starter
def valid_ballot(ballot, candidates):
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
--- explanation
One mark each, up to 5:

- Rejects an empty ballot.
- Checks every name on the ballot.
- Rejects a name that is not in the list of candidates.
- Rejects a name that appears twice.
- Returns `True` only when every check passes.
