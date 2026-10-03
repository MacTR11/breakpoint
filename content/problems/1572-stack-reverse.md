--- meta
{"title": "Reverse the words with a stack", "kind": "CODE", "difficulty": "EASY", "topic": "Stacks", "points": 10, "track": "structures", "specRef": "1.4.2", "functionName": "reverse_words", "banned": ["[::-1]", "reversed(", ".reverse("],
  "tests": [
    {"args": ["tide is high"], "expected": "high is tide"},
    {"args": ["one"], "expected": "one"},
    {"args": [""], "expected": ""},
    {"args": ["a b c d"], "expected": "d c b a", "hidden": true},
    {"args": ["Python is fun to write"], "expected": "write to fun is Python", "hidden": true}
  ]
}
--- description
Write the function `reverse_words(sentence)`, which returns the words of the sentence in reverse order, separated by single spaces. Use a list as a **stack**: push every word, then pop them all off.

For example, `reverse_words("tide is high")` returns `"high is tide"`. An empty sentence gives `""`.

Do not use slicing with a negative step, `reversed` or `reverse`.
--- hints
- `sentence.split()` gives the words. Push each one with `append`.
- Then `pop()` repeatedly until the stack is empty: the last word pushed comes off first. Join the popped words with `" ".join(...)`.
--- starter
def reverse_words(sentence):
    pass
--- solution
def reverse_words(sentence):
    stack = []
    for word in sentence.split():
        stack.append(word)
    reversed_words = []
    while len(stack) > 0:
        reversed_words.append(stack.pop())
    return " ".join(reversed_words)
