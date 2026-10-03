--- meta
{
  "title": "Reading a scores file", "kind": "CODE", "difficulty": "MEDIUM", "topic": "File handling", "points": 25, "track": "robust", "specRef": "3.3",
  "functionName": "top_scorer",
  "tests": [
    { "args": [["Ava,70", "Ben,85", "Cal,62"]], "expected": "Ben" },
    { "args": [["Ava,abc", "Ben,10"]], "expected": "Ben" },
    { "args": [[]], "expected": "" },
    { "args": [["Ava,50", "Ben,50"]], "expected": "Ava", "hidden": true },
    { "args": [["nonsense", "Dee"]], "expected": "", "hidden": true },
    { "args": [["Eve, 90 ", " Fay ,89"]], "expected": "Eve", "hidden": true },
    { "args": [["Hal,7,extra", "Ian,3"]], "expected": "Ian", "hidden": true },
    { "args": [["Jo,12.5", "Kim,12"]], "expected": "Kim", "hidden": true },
    { "args": [["Lee,-4", "Mo,-9"]], "expected": "Lee", "hidden": true },
    { "args": [["", "Ned,1"]], "expected": "Ned", "hidden": true }
  ]
}
--- description
Your program reads a text file of scores, one record per line, in the form `name,score`. Real files are messy, so the code has to cope with bad lines rather than crash.

Write a function `top_scorer(lines)` where `lines` is the list of lines read from the file. Return the **name** of the person with the highest score.

- A line is valid only if it has exactly two fields separated by a comma, and the second is a whole number.
- Ignore spaces around the name and around the score.
- Skip invalid lines.
- If two people share the highest score, return the one who appears first.
- If there are no valid lines, return an empty string `""`.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `top_scorer(["Ava,70", "Ben,85", "Cal,62"])` | `"Ben"` | |
| `top_scorer(["Ava,abc", "Ben,10"])` | `"Ben"` | Ava's line is invalid |
| `top_scorer([])` | `""` | |
--- hints
- `line.split(",")` gives a list of fields. Skip the line unless that list has exactly 2 items.
- Wrap `int(fields[1].strip())` in `try` / `except ValueError` and `continue` on an error. Only replace the best score when the new one is strictly greater, so the earlier person wins a tie.
--- starter
def top_scorer(lines):
    # Write your code here
    pass
--- solution
def top_scorer(lines):
    best_name = ""
    best_score = None
    for line in lines:
        fields = line.split(",")
        if len(fields) != 2:
            continue
        try:
            score = int(fields[1].strip())
        except ValueError:
            continue
        if best_score is None or score > best_score:
            best_score = score
            best_name = fields[0].strip()
    return best_name
