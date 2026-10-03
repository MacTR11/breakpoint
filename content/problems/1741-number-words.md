--- meta
{"title": "Numbers in words", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Selection and strings", "points": 25, "track": "basics", "specRef": "2.2.1", "functionName": "in_words",
  "tests": [
    {"args": [7], "expected": "seven"},
    {"args": [13], "expected": "thirteen"},
    {"args": [40], "expected": "forty"},
    {"args": [42], "expected": "forty-two", "hidden": true},
    {"args": [0], "expected": "zero", "hidden": true},
    {"args": [99], "expected": "ninety-nine", "hidden": true},
    {"args": [20], "expected": "twenty", "hidden": true},
    {"args": [71], "expected": "seventy-one", "hidden": true}
  ]
}
--- description
Write the function `in_words(n)`, which returns a whole number from 0 to 99 written out in lower-case words, with a hyphen in numbers like 42.

| `n` | returns |
| --- | --- |
| `7` | `"seven"` |
| `13` | `"thirteen"` |
| `40` | `"forty"` |
| `42` | `"forty-two"` |
--- hints
- Keep two lists: the words for 0 to 19, and the words for the tens (twenty, thirty... ninety).
- Below 20, look the word up. Otherwise take the tens word for `n // 10`, and if `n % 10` is not 0, add a hyphen and the units word.
--- starter
def in_words(n):
    pass
--- solution
def in_words(n):
    small = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
             "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    if n < 20:
        return small[n]
    words = tens[n // 10]
    if n % 10 != 0:
        words = words + "-" + small[n % 10]
    return words
