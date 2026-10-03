--- meta
{"title": "The Vigenère cipher", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Ciphers", "points": 25, "track": "strings", "specRef": "2.2.1", "functionName": "vigenere",
  "tests": [
    {"args": ["attack", "lemon"], "expected": "lxfopv"},
    {"args": ["HELLO", "b"], "expected": "IFMMP"},
    {"args": ["", "key"], "expected": ""},
    {"args": ["abc", "aaa"], "expected": "abc", "hidden": true},
    {"args": ["zebra", "z"], "expected": "ydaqz", "hidden": true},
    {"args": ["python", "cs"], "expected": "rqvzqf", "hidden": true}
  ]
}
--- description
The Vigenère cipher is a Caesar cipher whose shift changes letter by letter. Each letter of the key gives a shift (`a` is 0, `b` is 1, up to `z` is 25), and the key is repeated as often as needed.

Write the function `vigenere(text, key)`, which encrypts `text` and returns the result. `text` and `key` contain only lower-case letters, except that `text` may also be in capitals: keep each letter's case. The key has at least one letter.

For example, `vigenere("attack", "lemon")` returns `"lxfopv"`: `a` shifted by `l` (11) is `l`, `t` shifted by `e` (4) is `x`, and so on.
--- hints
- For the letter at position `i`, the key letter is `key[i % len(key)]`, and its shift is `ord(key letter) - ord("a")`.
- Shift a lower-case letter with `chr((ord(ch) - ord("a") + shift) % 26 + ord("a"))`, and use `"A"` in place of `"a"` for capitals.
--- starter
def vigenere(text, key):
    pass
--- solution
def vigenere(text, key):
    result = ""
    for i in range(len(text)):
        shift = ord(key[i % len(key)]) - ord("a")
        base = ord("A") if text[i].isupper() else ord("a")
        result = result + chr((ord(text[i]) - base + shift) % 26 + base)
    return result
