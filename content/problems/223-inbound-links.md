--- meta
{
  "title": "Counting inbound links", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Search engines", "points": 25, "track": "lists", "specRef": "1.3.4",
  "functionName": "inbound_links",
  "tests": [
    { "args": [{ "A": ["B", "C"], "B": ["C"], "C": [] }], "expected": { "A": 0, "B": 1, "C": 2 } },
    { "args": [{ "home": ["about"], "about": ["home"] }], "expected": { "home": 1, "about": 1 } },
    { "args": [{}], "expected": {} },
    { "args": [{ "solo": [] }], "expected": { "solo": 0 }, "hidden": true },
    { "args": [{ "a": ["d"], "b": ["d"], "c": ["d"], "d": ["a"] }], "expected": { "a": 1, "b": 0, "c": 0, "d": 3 }, "hidden": true },
    { "args": [{ "p": ["q", "r"], "q": ["p", "r"], "r": ["p", "q"] }], "expected": { "p": 2, "q": 2, "r": 2 }, "hidden": true }
  ]
}
--- description
The PageRank algorithm ranks a web page by the links pointing **to** it: a page that many others link to is probably important. The first step is to count each page's inbound links.

Write a function `inbound_links(links)`. `links` is a dictionary where each key is a page and its value is the list of pages it links **to**. Return a dictionary giving, for every page, the number of pages that link to it.

Every page that is linked to also appears as a key, and a page never links to itself or to the same page twice.

### Example

```python
links = {"A": ["B", "C"], "B": ["C"], "C": []}
inbound_links(links)
```

returns `{"A": 0, "B": 1, "C": 2}`: nothing links to A, only A links to B, and both A and B link to C.
--- hints
- Start by giving every page a count of 0, so that pages nobody links to still appear in the answer.
- Then loop through every page's list of links, adding 1 to the count of each page it links to.
--- starter
def inbound_links(links):
    # Write your code here
    pass
--- solution
def inbound_links(links):
    counts = {}
    for page in links:
        counts[page] = 0
    for page in links:
        for target in links[page]:
            counts[target] += 1
    return counts
