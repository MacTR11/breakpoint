--- meta
{"contest": "code-breakers", "title": "Crack the shift", "kind": "CODE", "difficulty": "HARD", "topic": "Ciphers", "points": 50, "track": "strings", "specRef": "2.2.1", "functionName": "crack_shift",
  "tests": [
    {"args": ["phhw ph khuh"], "expected": 3},
    {"args": ["sjajw jajw yjqq"], "expected": 5},
    {"args": ["hhhh"], "expected": 3},
    {"args": ["nby mywlyn cm ch nby nlyy"], "expected": 20, "hidden": true},
    {"args": ["hp yppo pwpgpy cpo apyd"], "expected": 11, "hidden": true},
    {"args": ["seven geese"], "expected": 0, "hidden": true},
    {"args": ["dkdfzms"], "expected": 25, "hidden": true}
  ]
}
--- description
A message has been hidden with a Caesar shift: every lower-case letter was moved the same number of places along the alphabet, wrapping round from z to a. Spaces were left alone.

In English the most common letter is usually e. Write `crack_shift(cipher)`, which finds the most common letter in `cipher` and returns the shift that would have turned e into it, from 0 to 25. If two letters are equally common, use the one earlier in the alphabet.

For example `crack_shift("phhw ph khuh")` is `3`: h is the most common letter, and h is 3 places after e.
--- hints
- Count each letter with a list of 26 zeros, one for each letter of the alphabet. `counts.index(max(counts))` is the place of the most common one, and picks the earliest if there is a tie.
- e is place 4. If the most common letter is at place `most`, the shift is `(most - 4) % 26`: the `% 26` stops it going negative.
--- starter
def crack_shift(cipher):
    # Write your code here
    pass
--- solution
def crack_shift(cipher):
    counts = [0] * 26
    for ch in cipher:
        if "a" <= ch <= "z":
            counts[ord(ch) - ord("a")] += 1
    most = counts.index(max(counts))
    return (most - (ord("e") - ord("a"))) % 26
