--- meta
{"title": "Fix: Basket Total", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Dictionary errors", "points": 20, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "functionName": "basket_total",
  "tests": [
    {"args": [{"pen": 2, "pad": 1}, {"pen": 50, "pad": 120}], "expected": 220},
    {"args": [{"pen": 1, "ink": 3}, {"pen": 50}], "expected": 50},
    {"args": [{}, {"pen": 50}], "expected": 0},
    {"args": [{"a": 3}, {"a": 0}], "expected": 0, "hidden": true},
    {"args": [{"x": 1, "y": 1}, {}], "expected": 0, "hidden": true},
    {"args": [{"pen": 10}, {"pen": 50, "pad": 1}], "expected": 500, "hidden": true}
  ]
}
--- description
`basket_total(basket, prices)` works out the cost of a shopping basket in pence.

- `basket` maps each item to the **quantity** wanted.
- `prices` maps each item to its price.
- An item with no price is out of stock and should be ignored.

There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- Two pens at 50p and one pad at 120p should cost 220p. The function says 170p. What has it forgotten to use?
- Looking up a key that is not in a dictionary raises a `KeyError`. Check `if item in prices` first.
--- starter
def basket_total(basket, prices):
    total = 0
    for item in basket:
        total = total + prices[item]
    return total
--- solution
def basket_total(basket, prices):
    total = 0
    for item in basket:
        if item in prices:
            total = total + prices[item] * basket[item]
    return total
