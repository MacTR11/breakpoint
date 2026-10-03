--- meta
{"title": "String handling (c): count words by first letter", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "count_starting",
  "tests": [
    {"args": ["the tower and the tram", "t"], "expected": 4},
    {"args": ["Blackpool beach is busy", "b"], "expected": 3},
    {"args": ["one", "x"], "expected": 0},
    {"args": ["", "a"], "expected": 0, "hidden": true},
    {"args": ["Apple and avocado are amazing", "A"], "expected": 5, "hidden": true},
    {"args": ["sea sand sun", "s"], "expected": 3, "hidden": true},
    {"args": ["a b c a B A", "a"], "expected": 3, "hidden": true}
  ]
}
--- description
Write the function `count_starting(sentence, letter)`, which returns the number of words in `sentence` that begin with `letter`. Upper and lower case count as the same letter.

The words in the sentence are separated by single spaces, and there is no punctuation.

For example, `count_starting("the tower and the tram", "t")` returns `4`.

**[4 marks]**
--- hints
- `sentence.split(" ")` gives a list of the words. An empty sentence gives `[""]`, so check a word is not empty before looking at `word[0]`.
- Convert both sides to lower case before comparing: `word[0].lower() == letter.lower()`.
--- starter
def count_starting(sentence, letter):
    pass
--- solution
def count_starting(sentence, letter):
    count = 0
    for word in sentence.split(" "):
        if word != "" and word[0].lower() == letter.lower():
            count = count + 1
    return count
--- explanation
One mark each, up to 4:

- Splits the sentence into words (or otherwise finds the first letter of each word).
- Compares the first character of each word with the letter.
- Ignores case in the comparison.
- Counts the matches and returns the count, without crashing on an empty sentence.
