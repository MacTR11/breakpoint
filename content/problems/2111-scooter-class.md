--- meta
{"title": "Scooter hire (a): the Scooter class", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Classes", "points": 35, "track": "exam", "specRef": "1.2.4", "functionName": "Scooter",
  "tests": [
    {"steps": [["Scooter", "S1"], ["get_id"], ["get_battery"], ["ride", 10], ["get_battery"], ["is_available"]], "expected": ["S1", 100, true, 80, true]},
    {"steps": [["Scooter", "S2"], ["ride", 45], ["get_battery"], ["is_available"], ["ride", 6], ["charge"], ["get_battery"]], "expected": [true, 10, false, false, null, 100]},
    {"steps": [["Scooter", "S3"], ["ride", 40], ["is_available"], ["ride", 1], ["is_available"], ["ride", 9], ["ride", 10], ["get_battery"]], "expected": [true, true, true, false, true, false, 0], "hidden": true},
    {"steps": [["Scooter", "S4"], ["ride", 50], ["get_battery"], ["ride", 0], ["is_available"]], "expected": [true, 0, true, false], "hidden": true},
    {"steps": [["Scooter", "S5"], ["ride", 51], ["get_battery"]], "expected": [false, 100], "hidden": true}
  ]
}
--- description
A town runs a fleet of electric scooters. Each scooter has an ID and a battery that is a whole-number percentage, starting at 100. Riding uses 2% of the battery for every minute.

Write the class `Scooter` with:

- a constructor `Scooter(scooter_id)` that stores the ID and sets the battery to 100. Both attributes must be private.
- `get_id()` and `get_battery()`
- `ride(minutes)`. If the battery has enough charge for the whole ride, it reduces the battery and returns `True`. If it does not, the battery is left alone and it returns `False`.
- `charge()`, which sets the battery back to 100
- `is_available()`, which returns `True` if the battery is at least 20.

**[7 marks]**
--- hints
- Work out the cost of the ride first: `minutes * 2`. Compare it with the battery before changing anything.
- Private attributes start with two underscores, such as `self.__battery`.
--- starter
class Scooter:
    def __init__(self, scooter_id):
        pass
--- solution
class Scooter:
    def __init__(self, scooter_id):
        self.__id = scooter_id
        self.__battery = 100

    def get_id(self):
        return self.__id

    def get_battery(self):
        return self.__battery

    def ride(self, minutes):
        cost = minutes * 2
        if cost > self.__battery:
            return False
        self.__battery = self.__battery - cost
        return True

    def charge(self):
        self.__battery = 100

    def is_available(self):
        return self.__battery >= 20
--- explanation
One mark each, up to 7:

- Constructor takes the ID, and sets the ID and a battery of 100.
- Both attributes are private.
- The two get methods return the right attributes.
- `ride` works out the charge needed as 2 per minute.
- `ride` refuses (returns `False`, battery unchanged) when there is not enough charge.
- `ride` otherwise reduces the battery and returns `True`.
- `charge` sets 100, and `is_available` compares with 20 using `>=`.
