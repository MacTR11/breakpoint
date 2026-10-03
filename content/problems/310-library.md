--- meta
{
  "title": "Library Loans", "kind": "CODE", "difficulty": "HARD", "topic": "Class design", "points": 50, "track": "oop", "specRef": "3.3",
  "functionName": "Library",
  "tests": [
    { "steps": [["Library"], ["add_book", "Dune"], ["add_book", "Dune"], ["borrow", "Dune", "amy"], ["borrow", "Dune", "ben"], ["on_loan"]], "expected": [true, false, true, false, ["Dune"]] },
    { "steps": [["Library"], ["borrow", "Emma", "amy"], ["return_book", "Emma"], ["on_loan"]], "expected": [false, false, []] },
    { "steps": [["Library"], ["add_book", "Ulysses"], ["add_book", "Beloved"], ["borrow", "Ulysses", "amy"], ["borrow", "Beloved", "amy"], ["borrowed_by", "amy"], ["return_book", "Beloved"], ["borrowed_by", "amy"], ["borrowed_by", "zed"]], "expected": [true, true, true, true, ["Beloved", "Ulysses"], true, ["Ulysses"], []] },
    { "steps": [["Library"], ["add_book", "A"], ["borrow", "A", "x"], ["return_book", "A"], ["return_book", "A"], ["borrow", "A", "y"], ["borrowed_by", "x"], ["borrowed_by", "y"], ["on_loan"]], "expected": [true, true, true, false, true, [], ["A"], ["A"]], "hidden": true },
    { "steps": [["Library"], ["add_book", "c"], ["add_book", "a"], ["add_book", "b"], ["borrow", "c", "m"], ["borrow", "a", "m"], ["borrow", "b", "n"], ["on_loan"], ["borrowed_by", "m"]], "expected": [true, true, true, true, true, true, ["a", "b", "c"], ["a", "c"]], "hidden": true },
    { "steps": [["Library"], ["on_loan"], ["borrowed_by", "nobody"], ["return_book", "ghost"]], "expected": [[], [], false], "hidden": true }
  ]
}
--- description
This is a small version of the kind of system you might build for a programming project. The challenge is designing the data structure inside the class, then making every method robust against misuse.

Write a class `Library`, created with no arguments, that starts with no books.

| Method | What it does |
| --- | --- |
| `add_book(title)` | Adds a book. Returns `True`, or `False` if the library already has that title. |
| `borrow(title, member)` | Lends the book to `member`. Returns `True`, or `False` if the library does not have the book or it is already on loan. |
| `return_book(title)` | Returns the book. Returns `True`, or `False` if that book was not on loan. |
| `on_loan()` | Returns a list of the titles currently on loan, in alphabetical order. |
| `borrowed_by(member)` | Returns a list of the titles that member currently has, in alphabetical order. |

### Example

```python
library = Library()
library.add_book("Dune")          # True
library.add_book("Dune")          # False: already there
library.borrow("Dune", "amy")     # True
library.borrow("Dune", "ben")     # False: amy has it
library.on_loan()                 # ["Dune"]
```

### Design question

What will you store? One option is a dictionary mapping each title to the member who has it, or to `None` when it is on the shelf.
--- hints
- A single dictionary is enough: each title maps to the member who has it, or to `None` when it is on the shelf.
- `on_loan` and `borrowed_by` both loop through the dictionary, pick out the matching titles and return them with `sorted(...)`.
--- starter
class Library:
    def __init__(self):
        # Decide what to store here
        pass

    def add_book(self, title):
        pass

    def borrow(self, title, member):
        pass

    def return_book(self, title):
        pass

    def on_loan(self):
        pass

    def borrowed_by(self, member):
        pass
--- solution
class Library:
    def __init__(self):
        self.books = {}

    def add_book(self, title):
        if title in self.books:
            return False
        self.books[title] = None
        return True

    def borrow(self, title, member):
        if title not in self.books or self.books[title] is not None:
            return False
        self.books[title] = member
        return True

    def return_book(self, title):
        if title not in self.books or self.books[title] is None:
            return False
        self.books[title] = None
        return True

    def on_loan(self):
        return sorted(title for title in self.books if self.books[title] is not None)

    def borrowed_by(self, member):
        return sorted(title for title in self.books if self.books[title] == member)
