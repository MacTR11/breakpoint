--- meta
{"title": "Election (c): the instant runoff", "kind": "CODE", "difficulty": "HARD", "topic": "Algorithms on records", "points": 45, "track": "exam", "specRef": "2.2.1", "functionName": "runoff_winner",
  "tests": [
    {"args": [[["Ada", "Cy"], ["Ben"], ["Cy", "Ada"], ["Ada"], ["Ben", "Ada"], [], ["Ada", "Ada"]], ["Ada", "Ben", "Cy"]], "expected": "Ada"},
    {"args": [[["Ada"], ["Ben"], ["Ben"]], ["Ada", "Ben", "Cy"]], "expected": "Ben"},
    {"args": [[["Cy", "Ben"], ["Ada", "Ben"], ["Ben"], ["Ben"], ["Cy", "Ada"]], ["Ada", "Ben", "Cy"]], "expected": "Ben"},
    {"args": [[["Ada", "Ben"], ["Ben", "Ada"], ["Cy", "Ada"], ["Cy", "Ada"], ["Ada", "Cy"]], ["Ada", "Ben", "Cy"]], "expected": "Ada", "hidden": true},
    {"args": [[["Ada"], ["Ben"]], ["Ada", "Ben"]], "expected": "Ada", "hidden": true},
    {"args": [[["Dee", "Ada"], ["Ben", "Ada"], ["Cy", "Ada"], ["Ada"]], ["Ada", "Ben", "Cy", "Dee"]], "expected": "Ada", "hidden": true}
  ]
}
--- description
The student council election uses ranked ballots. Each ballot is a list of candidates' names in the voter's order of preference, first choice first, for example `["Ada", "Cy", "Ben"]`. A voter does not have to rank every candidate. The list `candidates` holds every candidate's name.

The winner is decided by an **instant runoff**:

1. Count each valid ballot as a vote for its highest-ranked candidate who has not been knocked out.
2. If one candidate has more than half of the votes being counted, they win.
3. Otherwise, knock out the candidate with the fewest votes. If several are tied on fewest, knock out the one that comes **last** alphabetically. Then go back to step 1.

A ballot whose candidates have all been knocked out stops counting. Write the function `runoff_winner(ballots, candidates)`, which returns the winner's name. You can assume there is at least one valid ballot.

You may use your function from part (a); if you do, include it in your answer.

**[9 marks]**
--- hints
- Keep a list of the candidates still in the race. Each round, count every valid ballot for its first name that is still in the race, if it has one.
- Only ballots that count for someone this round make up the total: a winner needs more than half of that.
- To choose who goes, find the smallest count among those still in, then remove the alphabetically last of the candidates with that count.
--- starter
def runoff_winner(ballots, candidates):
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

def runoff_winner(ballots, candidates):
    standing = list(candidates)
    while True:
        counts = {}
        for name in standing:
            counts[name] = 0
        total = 0
        for ballot in ballots:
            if not valid_ballot(ballot, candidates):
                continue
            for name in ballot:
                if name in standing:
                    counts[name] = counts[name] + 1
                    total = total + 1
                    break
        for name in standing:
            if counts[name] * 2 > total:
                return name
        fewest = min(counts[name] for name in standing)
        tied = [name for name in standing if counts[name] == fewest]
        standing.remove(max(tied))
--- explanation
One mark each, up to 9:

- Keeps track of the candidates still in the race.
- Ignores invalid ballots.
- Counts each ballot for its highest-ranked candidate still in the race.
- Leaves out ballots with nobody left in the race.
- Totals the votes being counted this round.
- Declares a winner who has more than half of that total.
- Finds the smallest number of votes among those still in.
- Breaks a tie for fewest by knocking out the alphabetically last.
- Repeats the rounds until there is a winner, and returns their name.
