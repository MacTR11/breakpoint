--- meta
{"title": "Capitals for every word", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 10, "track": "strings", "specRef": "2.2.1", "functionName": "capitalise_words", "banned": [".title(", ".capitalize(", "capwords"],
  "tests": [
    {"args": ["the north pier"], "expected": "The North Pier"},
    {"args": ["BLACKPOOL TOWER"], "expected": "Blackpool Tower"},
    {"args": ["a"], "expected": "A"},
    {"args": [""], "expected": "", "hidden": true},
    {"args": ["mIXed cAsE wOrds"], "expected": "Mixed Case Words", "hidden": true},
    {"args": ["one  two"], "expected": "One  Two", "hidden": true}
  ]
}
--- description
Write the function `capitalise_words(text)`, which returns the text with the first letter of every word in upper case and every other letter in lower case. Words are separated by spaces, and the spaces must be kept exactly as they are.

For example, `capitalise_words("the north pier")` returns `"The North Pier"`.

Do it yourself: do not use `title` or `capitalize`.
--- hints
- Go through the characters with their positions. A character starts a word if it is the first character, or the character before it is a space.
- Build the answer one character at a time: `.upper()` for the start of a word, `.lower()` for the rest.
--- starter
def capitalise_words(text):
    pass
--- solution
def capitalise_words(text):
    result = ""
    for i in range(len(text)):
        if i == 0 or text[i - 1] == " ":
            result = result + text[i].upper()
        else:
            result = result + text[i].lower()
    return result
