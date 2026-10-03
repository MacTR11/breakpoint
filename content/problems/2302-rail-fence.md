--- meta
{"contest": "code-breakers", "title": "Rail fence", "kind": "CODE", "difficulty": "HARD", "topic": "Ciphers", "points": 50, "track": "strings", "specRef": "2.2.1", "functionName": "rail_fence",
  "tests": [
    {"args": ["HELLOWORLD", 3], "expected": "HOLELWRDLO"},
    {"args": ["ATTACK", 2], "expected": "ATCTAK"},
    {"args": ["PYTHON", 1], "expected": "PYTHON"},
    {"args": ["AB", 3], "expected": "AB", "hidden": true},
    {"args": ["WEAREDISCOVERED", 4], "expected": "WIREDSEEAECVDRO", "hidden": true},
    {"args": ["", 3], "expected": "", "hidden": true},
    {"args": ["RAILFENCE", 2], "expected": "RIFNEALEC", "hidden": true}
  ]
}
--- description
The rail fence cipher writes a message in a zigzag down and up across a number of rails (rows), then reads each rail from left to right. With 3 rails, `HELLOWORLD` is written like this:

```
H . . . O . . . L .
. E . L . W . R . D
. . L . . . O . . .
```

Reading the rails in turn gives `HOL` + `ELWRD` + `LO`, so the cipher text is `HOLELWRDLO`.

Write `rail_fence(text, rails)`, which returns the cipher text. With 1 rail the message is unchanged.
--- hints
- Keep a string for each rail in a list, and add each letter to the rail it lands on.
- Track the current rail and a step of +1 or −1. The step turns round at the top rail and at the bottom rail.
--- starter
def rail_fence(text, rails):
    # Write your code here
    pass
--- solution
def rail_fence(text, rails):
    if rails == 1:
        return text
    rows = [""] * rails
    row = 0
    step = 1
    for ch in text:
        rows[row] = rows[row] + ch
        if row == 0:
            step = 1
        elif row == rails - 1:
            step = -1
        row = row + step
    return "".join(rows)
