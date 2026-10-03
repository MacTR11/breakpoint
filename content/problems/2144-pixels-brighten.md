--- meta
{"title": "Pixel images (d): brighten a greyscale image", "kind": "CODE", "difficulty": "EASY", "topic": "2D arrays", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "brighten",
  "tests": [
    {"args": [[[10, 200], [250, 0]], 60], "expected": [[70, 255], [255, 60]]},
    {"args": [[[0]], 0], "expected": [[0]]},
    {"args": [[], 10], "expected": []},
    {"args": [[[255, 254, 253]], 1], "expected": [[255, 255, 254]], "hidden": true},
    {"args": [[[100, 100], [100, 100], [100, 100]], 155], "expected": [[255, 255], [255, 255], [255, 255]], "hidden": true}
  ]
}
--- description
The program also stores greyscale images as two-dimensional arrays of whole numbers from 0 (black) to 255 (white).

Write the function `brighten(image, amount)`, which returns a **new** image with `amount` added to every pixel. No pixel may go above 255. The original image must not be changed.

For example, `brighten([[10, 200], [250, 0]], 60)` returns `[[70, 255], [255, 60]]`.

**[4 marks]**
--- hints
- Build a new list of rows. For each row in the image, build a new row of brightened values.
- Use `min(value + amount, 255)`, or an `if`, to cap each pixel at 255.
--- starter
def brighten(image, amount):
    pass
--- solution
def brighten(image, amount):
    result = []
    for row in image:
        new_row = []
        for value in row:
            new_row.append(min(value + amount, 255))
        result.append(new_row)
    return result
--- explanation
One mark each, up to 4:

- Creates a new 2D array rather than changing the original.
- Visits every pixel in every row.
- Adds the amount to each pixel, capping it at 255.
- Returns the new image with the same shape as the original.
