--- meta
{"title": "Car park (c): the CarPark class", "kind": "CODE", "difficulty": "HARD", "topic": "Classes", "points": 40, "track": "exam", "specRef": "1.2.4", "functionName": "CarPark",
  "tests": [
    {"steps": [["CarPark", 2], ["spaces"], ["enter", "AB12 CDE"], ["enter", "XY99 ZZZ"], ["enter", "CD34 EFG"], ["spaces"], ["leave", "AB12 CDE", 45], ["spaces"], ["enter", "CD34 EFG"]], "expected": [2, true, true, false, 0, 1.5, 1, true]},
    {"steps": [["CarPark", 3], ["enter", "AB12 CDE"], ["enter", "AB12 CDE"], ["leave", "XY99 ZZZ", 10], ["leave", "AB12 CDE", 600], ["leave", "AB12 CDE", 5]], "expected": [true, false, -1, 12, -1]},
    {"steps": [["CarPark", 1], ["enter", "ab12 cde"], ["spaces"], ["enter", "AB12 CDE"], ["takings"], ["leave", "AB12 CDE", 91], ["takings"], ["enter", "XY99 ZZZ"], ["leave", "XY99 ZZZ", 20], ["takings"]], "expected": [false, 1, true, 0, 3.0, 3.0, true, 0, 3.0], "hidden": true},
    {"steps": [["CarPark", 0], ["enter", "AB12 CDE"], ["spaces"], ["takings"]], "expected": [false, 0, 0], "hidden": true}
  ]
}
--- description
A seafront car park records cars by their number plate. Plates are strings such as `"AB12 CDE"`: two capital letters, two digits, a space, then three capital letters.

The functions from parts (a) and (b) are in the editor: `valid_plate(text)` and `charge(minutes)`.

Write the class `CarPark` with:

- a constructor `CarPark(capacity)` that starts with no cars parked and no money taken
- `spaces()`, which returns how many spaces are free
- `enter(plate)`, which parks the car and returns `True`. It returns `False`, changing nothing, if the plate is not valid, the car is already parked, or there are no free spaces.
- `leave(plate, minutes)`, which removes a parked car, adds its charge to the takings and returns the charge. If the car is not parked it returns `-1`.
- `takings()`, which returns the total charged so far.

**[8 marks]**
--- hints
- Keep a list (or set) of the plates parked now, the capacity, and a running total of takings.
- `enter` has three reasons to refuse: check `valid_plate`, check the plate is not already parked, and check there is a free space.
- `leave` works out `charge(minutes)` with the function given, then removes the plate and adds the charge to the total.
--- starter
def valid_plate(text):
    if len(text) != 8 or text[4] != " ":
        return False
    for i in [0, 1, 5, 6, 7]:
        if not ("A" <= text[i] <= "Z"):
            return False
    for i in [2, 3]:
        if not text[i].isdigit():
            return False
    return True


def charge(minutes):
    paid = minutes - 30
    if paid <= 0:
        return 0
    hours = paid // 60
    if paid % 60 != 0:
        hours = hours + 1
    return min(hours * 1.5, 12)


class CarPark:
    def __init__(self, capacity):
        pass
--- solution
def valid_plate(text):
    if len(text) != 8 or text[4] != " ":
        return False
    for i in [0, 1, 5, 6, 7]:
        if not ("A" <= text[i] <= "Z"):
            return False
    for i in [2, 3]:
        if not text[i].isdigit():
            return False
    return True


def charge(minutes):
    paid = minutes - 30
    if paid <= 0:
        return 0
    hours = paid // 60
    if paid % 60 != 0:
        hours = hours + 1
    return min(hours * 1.5, 12)


class CarPark:
    def __init__(self, capacity):
        self.__capacity = capacity
        self.__parked = []
        self.__takings = 0

    def spaces(self):
        return self.__capacity - len(self.__parked)

    def enter(self, plate):
        if not valid_plate(plate) or plate in self.__parked or self.spaces() == 0:
            return False
        self.__parked.append(plate)
        return True

    def leave(self, plate, minutes):
        if plate not in self.__parked:
            return -1
        self.__parked.remove(plate)
        cost = charge(minutes)
        self.__takings = self.__takings + cost
        return cost

    def takings(self):
        return self.__takings
--- explanation
One mark each, up to 8:

- The constructor stores the capacity, an empty collection of parked cars and takings of 0.
- `spaces` returns the capacity minus the number parked.
- `enter` refuses an invalid plate, using part (a).
- `enter` refuses a car that is already parked.
- `enter` refuses when there are no free spaces, and otherwise parks the car and returns `True`.
- `leave` returns `-1` for a car that is not parked.
- `leave` removes the car and works out the charge using part (b).
- The charge is added to the takings and returned, and `takings` returns the total.
