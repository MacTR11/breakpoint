--- meta
{"title": "Anagram Groups", "kind": "CODE", "difficulty": "HARD", "topic": "Dictionaries", "points": 40, "track": "lists", "specRef": "2.2.1", "contest": "grand-final", "functionName": "anagram_groups",
  "tests": [
    {"args": [["tea", "eat", "tan", "ate", "nat", "bat"]], "expected": [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]},
    {"args": [["a"]], "expected": [["a"]]},
    {"args": [[]], "expected": []},
    {"args": [["ab", "ba", "abc"]], "expected": [["ab", "ba"], ["abc"]], "hidden": true},
    {"args": [["listen", "silent", "enlist", "google"]], "expected": [["enlist", "listen", "silent"], ["google"]], "hidden": true},
    {"args": [["zz", "y", "x"]], "expected": [["x"], ["y"], ["zz"]], "hidden": true}
  ]
}
--- description
Two words are anagrams if they use exactly the same letters, such as `tea` and `eat`.

Write a function `anagram_groups(words)` that sorts a list of different lower-case words into groups of anagrams.

- Return a list of groups, where each group is a list of words.
- Within each group, the words are in alphabetical order.
- The groups themselves are ordered by their first word.

### Example

`anagram_groups(["tea", "eat", "tan", "ate", "nat", "bat"])` returns

`[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]`
--- hints
- Two words are anagrams exactly when their letters, sorted, are the same: `"".join(sorted(word))` gives `"aet"` for tea, eat and ate.
- Use that sorted string as a dictionary key, with a list of the matching words as the value. At the end, sort each list, then sort the list of lists.
--- starter
def anagram_groups(words):
    # Write your code here
    pass
--- solution
def anagram_groups(words):
    groups = {}
    for word in words:
        key = "".join(sorted(word))
        if key not in groups:
            groups[key] = []
        groups[key].append(word)
    result = []
    for key in groups:
        result.append(sorted(groups[key]))
    return sorted(result)
