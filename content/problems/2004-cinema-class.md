--- meta
{"title": "Cinema (d): a Screen class", "kind": "CODE", "difficulty": "HARD", "topic": "Classes and 2D arrays", "points": 45, "track": "exam", "specRef": "1.2.4", "functionName": "Screen",
  "tests": [
    {"steps": [["Screen", 2, 3], ["count_free"], ["book", 0, 1], ["book", 0, 1], ["count_free"], ["is_free", 0, 1], ["is_free", 1, 2]], "expected": [6, true, false, 5, false, true]},
    {"steps": [["Screen", 1, 2], ["book", 0, 0], ["book", 0, 1], ["count_free"], ["cancel", 0, 0], ["cancel", 0, 0], ["count_free"]], "expected": [true, true, 0, true, false, 1]},
    {"steps": [["Screen", 2, 2], ["book", 2, 0], ["book", 0, 2], ["book", -1, 0], ["count_free"], ["is_free", 5, 5]], "expected": [false, false, false, 4, false], "hidden": true},
    {"steps": [["Screen", 3, 4], ["book", 1, 1], ["book", 1, 2], ["cancel", 1, 1], ["is_free", 1, 1], ["is_free", 1, 2], ["count_free"]], "expected": [true, true, true, true, false, 11], "hidden": true},
    {"steps": [["Screen", 1, 1], ["cancel", 0, 0], ["book", 0, 0], ["cancel", 0, 0], ["book", 0, 0], ["count_free"]], "expected": [false, true, true, true, 0], "hidden": true}
  ]
}
--- description
A cinema wants each screen to be an object. A screen has a fixed number of rows, each with the same number of seats, and every seat starts off free.

Write the class `Screen` with:

- a constructor `Screen(rows, columns)` that creates a private two-dimensional array of seats, all free
- `is_free(row, column)`, which returns `True` if that seat exists and is free, and `False` otherwise
- `book(row, column)`, which books the seat and returns `True` if it exists and is free; otherwise it changes nothing and returns `False`
- `cancel(row, column)`, which frees the seat and returns `True` if it exists and is booked; otherwise it changes nothing and returns `False`
- `count_free()`, which returns how many seats are free.

Row and column numbers start at 0. A negative number, or one that is too large, is a seat that does not exist.

**[9 marks]**
--- hints
- Build the array in the constructor with a loop inside a loop, appending one `"F"` per seat. Store it in an attribute such as `self.__seats`.
- Write one helper that says whether `(row, column)` is inside the array, and use it in `is_free`, `book` and `cancel` so the bounds check is written once.
- `book` can be: if `self.is_free(row, column)` then mark it booked and return `True`, otherwise return `False`.
--- starter
class Screen:
    def __init__(self, rows, columns):
        pass
--- solution
class Screen:
    def __init__(self, rows, columns):
        self.__seats = []
        for r in range(rows):
            row = []
            for c in range(columns):
                row.append("F")
            self.__seats.append(row)

    def __exists(self, row, column):
        return 0 <= row < len(self.__seats) and 0 <= column < len(self.__seats[row])

    def is_free(self, row, column):
        return self.__exists(row, column) and self.__seats[row][column] == "F"

    def book(self, row, column):
        if self.is_free(row, column):
            self.__seats[row][column] = "B"
            return True
        return False

    def cancel(self, row, column):
        if self.__exists(row, column) and self.__seats[row][column] == "B":
            self.__seats[row][column] = "F"
            return True
        return False

    def count_free(self):
        free = 0
        for row in self.__seats:
            for seat in row:
                if seat == "F":
                    free = free + 1
        return free
--- explanation
One mark each, up to 9:

- Class header and a constructor taking `rows` and `columns`.
- The constructor builds a 2D array of the right size, with every seat free.
- The array is a private attribute, used through `self`.
- `is_free` rejects row and column numbers outside the array, including negatives.
- `is_free` returns whether an existing seat is free.
- `book` changes the seat only when it exists and is free, and returns `True`.
- `book` returns `False` and changes nothing otherwise.
- `cancel` mirrors `book`: frees only a seat that exists and is booked, with the correct return values.
- `count_free` visits every seat and returns the number that are free.
