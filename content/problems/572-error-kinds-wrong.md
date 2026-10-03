--- meta
{"title": "What kind of error? (2)", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Types of error", "points": 5, "track": "debugging", "specRef": "3.3", "options": ["A syntax error", "A runtime error", "A logic error", "A type error"], "answer": 2}
--- description
This function should convert an amount in pence to pounds.

```python
def to_pounds(pence):
    return pence * 100
```

`to_pounds(250)` runs without any error message and returns `25000`. The expected result was `2.5`.

What kind of error is this?
--- hints
- Did Python refuse to run the code? Did it crash part-way through?
- The program does exactly what the code says. The trouble is that the code says the wrong thing.
--- explanation
This is a **logic error**. The program runs to the end without complaint, but the algorithm is wrong: it multiplies when it should divide.

Logic errors are the hardest kind to find because nothing announces them. The only way to catch one is to test with data where you already know the right answer, and compare.
