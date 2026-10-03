--- meta
{"contest": "lower-sixth-league", "title": "Seat labels", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Arithmetic", "points": 25, "track": "basics", "specRef": "2.2.1", "functionName": "seat_label",
  "tests": [
    {"args": [1, 10], "expected": "A1"},
    {"args": [13, 10], "expected": "B3"},
    {"args": [10, 10], "expected": "A10"},
    {"args": [11, 10], "expected": "B1", "hidden": true},
    {"args": [26, 5], "expected": "F1", "hidden": true},
    {"args": [7, 3], "expected": "C1", "hidden": true},
    {"args": [100, 4], "expected": "Y4", "hidden": true}
  ]
}
--- description
A theatre numbers its seats 1, 2, 3 and so on, starting at the front left, with `per_row` seats in each row. Rows are lettered A at the front, then B, C and so on, and seats in a row are numbered from 1.

Write `seat_label(n, per_row)`, which returns the label printed on the ticket for seat `n`. With 10 seats a row, seat 1 is `"A1"`, seat 10 is `"A10"`, seat 11 is `"B1"` and seat 13 is `"B3"`.
--- hints
- Counting from 0 makes it easier: seat n is number n − 1 counting from 0. Then `// per_row` gives the row and `% per_row` the place in it.
- `chr(ord("A") + 2)` is `"C"`. Remember to add 1 back to the seat number.
--- starter
def seat_label(n, per_row):
    # Write your code here
    pass
--- solution
def seat_label(n, per_row):
    row = (n - 1) // per_row
    seat = (n - 1) % per_row + 1
    return chr(ord("A") + row) + str(seat)
