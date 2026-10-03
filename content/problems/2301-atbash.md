--- meta
{"contest": "code-breakers", "title": "Atbash", "kind": "CODE", "difficulty": "EASY", "topic": "Ciphers", "points": 10, "track": "strings", "specRef": "1.4.1", "functionName": "atbash",
  "tests": [
    {"args": ["abc"], "expected": "zyx"},
    {"args": ["Hello, World!"], "expected": "Svool, Dliow!"},
    {"args": ["zebra 42"], "expected": "avyiz 42"},
    {"args": [""], "expected": "", "hidden": true},
    {"args": ["AzBy"], "expected": "ZaYb", "hidden": true},
    {"args": ["Svool"], "expected": "Hello", "hidden": true},
    {"args": ["The quick brown fox."], "expected": "Gsv jfrxp yildm ulc.", "hidden": true}
  ]
}
--- description
The Atbash cipher swaps each letter for the one the same distance from the other end of the alphabet: a becomes z, b becomes y, c becomes x, and so on.

Write `atbash(text)`, which returns `text` with every letter swapped this way. Capital letters stay capital, and anything that is not a letter (spaces, digits, punctuation) is left as it is.

Running it twice gives back the original, so the same function both hides and reveals a message.
--- hints
- `ord("a")` is 97 and `chr(97)` is `"a"`. A letter's place in the alphabet is `ord(ch) - ord("a")`, from 0 for a to 25 for z.
- The swapped letter is that many places back from z: `chr(ord("z") - place)`. Do the same with `"A"` and `"Z"` for capitals.
--- starter
def atbash(text):
    # Write your code here
    pass
--- solution
def atbash(text):
    result = ""
    for ch in text:
        if "a" <= ch <= "z":
            result = result + chr(ord("z") - (ord(ch) - ord("a")))
        elif "A" <= ch <= "Z":
            result = result + chr(ord("Z") - (ord(ch) - ord("A")))
        else:
            result = result + ch
    return result
