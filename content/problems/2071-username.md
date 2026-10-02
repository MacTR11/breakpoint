--- meta
{"title": "String handling (a): make a username", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 10, "track": "exam", "specRef": "2.2.1", "functionName": "make_username",
  "tests": [
    {"args": ["Ada", "Lovelace", 2009], "expected": "alovelace09"},
    {"args": ["alan", "TURING", 2010], "expected": "aturing10"},
    {"args": ["Mo", "Li", 2000], "expected": "mli00"},
    {"args": ["Grace", "Hopper", 1998], "expected": "ghopper98", "hidden": true},
    {"args": ["Z", "Q", 2021], "expected": "zq21", "hidden": true},
    {"args": ["Katherine", "Johnson", 2007], "expected": "kjohnson07", "hidden": true}
  ]
}
--- description
A college gives every student a username made from:

- the first letter of their first name
- then their whole surname
- then the last two digits of the year they were born.

The username is all in lower case.

Write the function `make_username(first_name, surname, year)`, where `year` is an integer such as `2009`. It returns the username as a string.

For example, `make_username("Ada", "Lovelace", 2009)` returns `"alovelace09"`.

**[4 marks]**
--- hints
- `first_name[0]` is the first letter. `.lower()` converts a string to lower case.
- For the last two digits, convert the year to a string and take its last two characters: `str(year)[2:]`. That keeps the 0 in "09", which `year MOD 100` would lose.
--- starter
def make_username(first_name, surname, year):
    pass
--- solution
def make_username(first_name, surname, year):
    username = first_name[0] + surname + str(year)[2:]
    return username.lower()
--- explanation
One mark each, up to 4:

- Takes the first character of the first name.
- Takes the last two digits of the year as characters, keeping a leading zero.
- Concatenates the three parts in the right order.
- Converts the result to lower case and returns it.
