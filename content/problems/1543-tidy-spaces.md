--- meta
{"title": "Tidy the spaces", "kind": "CODE", "difficulty": "MEDIUM", "topic": "String handling", "points": 25, "track": "strings", "specRef": "2.2.1", "functionName": "tidy_spaces", "banned": [".split(", ".join(", "re."],
  "tests": [
    {"args": ["  too   many    spaces "], "expected": "too many spaces"},
    {"args": ["fine as it is"], "expected": "fine as it is"},
    {"args": ["   "], "expected": ""},
    {"args": [""], "expected": "", "hidden": true},
    {"args": ["a  b"], "expected": "a b", "hidden": true},
    {"args": [" x"], "expected": "x", "hidden": true}
  ]
}
--- description
Text copied from a web page often has extra spaces. Write the function `tidy_spaces(text)`, which returns the text with every run of spaces replaced by a single space, and no spaces at the start or the end.

For example, `tidy_spaces("  too   many    spaces ")` returns `"too many spaces"`.

Do it a character at a time: do not use `split`, `join` or regular expressions.
--- hints
- Add a space to the result only when the character is a space **and** the last character you added was not a space.
- Leading spaces are dealt with by never adding a space to an empty result. A trailing space can be removed at the end with `.strip()`, or by checking the last character.
--- starter
def tidy_spaces(text):
    pass
--- solution
def tidy_spaces(text):
    result = ""
    for ch in text:
        if ch == " ":
            if result != "" and result[-1] != " ":
                result = result + " "
        else:
            result = result + ch
    if result.endswith(" "):
        result = result[:-1]
    return result
