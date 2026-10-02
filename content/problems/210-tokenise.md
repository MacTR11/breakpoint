--- meta
{
  "title": "Lexical Analysis", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Translators", "points": 25, "track": "strings", "specRef": "1.2.2",
  "functionName": "tokenise",
  "tests": [
    { "args": ["x = 3 + 42"], "expected": ["x", "=", "3", "+", "42"] },
    { "args": ["total=price*(1+rate)"], "expected": ["total", "=", "price", "*", "(", "1", "+", "rate", ")"] },
    { "args": [""], "expected": [] },
    { "args": ["a1+b2"], "expected": ["a1", "+", "b2"], "hidden": true },
    { "args": ["  12  "], "expected": ["12"], "hidden": true },
    { "args": ["(a)/(b)"], "expected": ["(", "a", ")", "/", "(", "b", ")"], "hidden": true },
    { "args": ["x-1"], "expected": ["x", "-", "1"], "hidden": true },
    { "args": ["max_speed = 70"], "expected": ["max_speed", "=", "70"], "hidden": true }
  ]
}
--- description
The first stage of compilation is **lexical analysis**: the source code is stripped of white space and broken into **tokens**.

Write a function `tokenise(expression)` that returns the list of tokens in a line of code.

- A run of letters, digits and underscores is one token, such as `total`, `42` or `max_speed`.
- Each of the symbols `+ - * / ( ) =` is a token on its own.
- Spaces separate tokens but are not tokens themselves.

### Examples

| Call | Returns |
| --- | --- |
| `tokenise("x = 3 + 42")` | `["x", "=", "3", "+", "42"]` |
| `tokenise("total=price*(1+rate)")` | `["total", "=", "price", "*", "(", "1", "+", "rate", ")"]` |
--- hints
- Build up the current token character by character. `character.isalnum() or character == "_"` means it belongs to a name or a number.
- When you meet a symbol or a space, first add the token you were building (if any) to the list. Remember the last token when the loop ends.
--- starter
def tokenise(expression):
    # Write your code here
    pass
--- solution
def tokenise(expression):
    tokens = []
    current = ""
    for character in expression:
        if character.isalnum() or character == "_":
            current += character
        else:
            if current:
                tokens.append(current)
                current = ""
            if character in "+-*/()=":
                tokens.append(character)
    if current:
        tokens.append(current)
    return tokens
