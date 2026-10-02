--- meta
{
  "title": "Run-Length Encoding",
  "kind": "CODE",
  "difficulty": "MEDIUM",
  "topic": "Strings",
  "points": 25,
  "track": "strings", "specRef": "1.3.1",
  "functionName": "compress",
  "tests": [
    { "args": ["AAABBC"], "expected": "3A2B1C" },
    { "args": ["ABC"], "expected": "1A1B1C" },
    { "args": [""], "expected": "" },
    { "args": ["AAAAAAAAAAAA"], "expected": "12A", "hidden": true },
    { "args": ["aaAA"], "expected": "2a2A", "hidden": true },
    { "args": ["ABBA"], "expected": "1A2B1A", "hidden": true },
    { "args": ["Z"], "expected": "1Z", "hidden": true },
    { "args": ["WWWWBWW"], "expected": "4W1B2W", "hidden": true }
  ]
}
--- description
Run-length encoding (RLE) is a simple lossless compression method: each run of repeated characters is replaced by the length of the run followed by the character.

Write a function `compress(text)` that returns the run-length encoding of `text`.

### Examples

| Call | Returns |
| --- | --- |
| `compress("AAABBC")` | `"3A2B1C"` |
| `compress("ABC")` | `"1A1B1C"` |
| `compress("")` | `""` |

Upper and lower case are different characters, so `"aA"` becomes `"1a1A"`.
--- hints
- Walk along the string keeping the current character and a count of how many times it has repeated.
- When the character changes, add `str(count) + character` to the result and start a new count. Do not forget the final run after the loop ends.
--- starter
def compress(text):
    # Write your code here
    pass
--- solution
def compress(text):
    result = ""
    i = 0
    while i < len(text):
        j = i
        while j < len(text) and text[j] == text[i]:
            j += 1
        result += str(j - i) + text[i]
        i = j
    return result
