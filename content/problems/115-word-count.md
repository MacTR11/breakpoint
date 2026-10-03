--- meta
{
  "title": "Word counter", "kind": "CODE", "difficulty": "EASY", "topic": "Dictionaries", "points": 10, "track": "lists", "specRef": "2.2.1",
  "functionName": "word_count",
  "tests": [
    { "args": ["the cat the dog"], "expected": { "the": 2, "cat": 1, "dog": 1 } },
    { "args": ["Hi hi HI"], "expected": { "hi": 3 } },
    { "args": [""], "expected": {} },
    { "args": ["a"], "expected": { "a": 1 }, "hidden": true },
    { "args": ["one  two"], "expected": { "one": 1, "two": 1 }, "hidden": true },
    { "args": ["to be or not to be"], "expected": { "to": 2, "be": 2, "or": 1, "not": 1 }, "hidden": true }
  ]
}
--- description
Write a function `word_count(text)` that returns a **dictionary** showing how many times each word appears in `text`.

- Words are separated by one or more spaces.
- Treat upper and lower case as the same word, and use lower case for the dictionary keys.

### Examples

| Call | Returns |
| --- | --- |
| `word_count("the cat the dog")` | `{"the": 2, "cat": 1, "dog": 1}` |
| `word_count("Hi hi HI")` | `{"hi": 3}` |
| `word_count("")` | `{}` |
--- hints
- `text.lower().split()` gives a list of lower-case words, and copes with repeated spaces.
- For each word: if it is already a key in the dictionary add 1 to its count, otherwise set its count to 1.
--- starter
def word_count(text):
    # Write your code here
    pass
--- solution
def word_count(text):
    counts = {}
    for word in text.lower().split():
        if word in counts:
            counts[word] += 1
        else:
            counts[word] = 1
    return counts
