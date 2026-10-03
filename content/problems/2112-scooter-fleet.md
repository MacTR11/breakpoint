--- meta
{"title": "Scooter hire (b): the Fleet class", "kind": "CODE", "difficulty": "HARD", "topic": "Classes that use classes", "points": 40, "track": "exam", "specRef": "1.2.4", "functionName": "Fleet",
  "tests": [
    {"steps": [["Fleet"], ["add", "S1"], ["add", "S2"], ["available"], ["hire", "S1", 45], ["available"], ["hire", "S1", 1], ["charge_all"], ["available"]], "expected": [true, true, ["S1", "S2"], true, ["S2"], false, null, ["S1", "S2"]]},
    {"steps": [["Fleet"], ["add", "A"], ["add", "A"], ["hire", "Z", 5], ["available"]], "expected": [true, false, false, ["A"]]},
    {"steps": [["Fleet"], ["available"], ["add", "C"], ["add", "B"], ["add", "A"], ["available"], ["hire", "B", 50], ["hire", "B", 1], ["available"]], "expected": [[], true, true, true, ["A", "B", "C"], true, false, ["A", "C"]], "hidden": true},
    {"steps": [["Fleet"], ["add", "X"], ["hire", "X", 41], ["available"], ["hire", "X", 10], ["charge_all"], ["hire", "X", 10]], "expected": [true, true, [], false, null, true], "hidden": true}
  ]
}
--- description
A town runs a fleet of electric scooters. Each scooter has an ID and a battery that is a whole-number percentage, starting at 100. Riding uses 2% of the battery for every minute.

The class `Scooter` has been written for you, and is in the editor.

Write the class `Fleet`, which keeps its scooters in a private list. It has:

- a constructor that starts with no scooters
- `add(scooter_id)`, which creates a new `Scooter` with that ID and adds it to the fleet, then returns `True`. If the fleet already has a scooter with that ID, nothing is added and it returns `False`.
- `hire(scooter_id, minutes)`, which returns `True` only if the fleet has that scooter, it is available, and the ride succeeds. Otherwise it returns `False`.
- `available()`, which returns a list of the IDs of the available scooters, in alphabetical order
- `charge_all()`, which charges every scooter.

**[8 marks]**
--- hints
- Write a small helper that finds a scooter by its ID and returns it, or `None`. `add` and `hire` can both use it.
- `hire` should check the scooter exists and `is_available()` first, then return whatever `ride(minutes)` returns.
--- starter
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


class Fleet:
    def __init__(self):
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


class Fleet:
    def __init__(self):
        self.__scooters = []

    def __find(self, scooter_id):
        for scooter in self.__scooters:
            if scooter.get_id() == scooter_id:
                return scooter
        return None

    def add(self, scooter_id):
        if self.__find(scooter_id) is not None:
            return False
        self.__scooters.append(Scooter(scooter_id))
        return True

    def hire(self, scooter_id, minutes):
        scooter = self.__find(scooter_id)
        if scooter is None or not scooter.is_available():
            return False
        return scooter.ride(minutes)

    def available(self):
        ids = []
        for scooter in self.__scooters:
            if scooter.is_available():
                ids.append(scooter.get_id())
        return sorted(ids)

    def charge_all(self):
        for scooter in self.__scooters:
            scooter.charge()
--- explanation
One mark each, up to 8:

- The constructor creates an empty, private collection of scooters.
- `add` creates a `Scooter` object with the given ID and stores it.
- `add` refuses an ID that is already in the fleet.
- `hire` finds the scooter with the given ID, and returns `False` if there is none.
- `hire` returns `False` when the scooter is not available.
- `hire` otherwise returns the result of the scooter's `ride` method.
- `available` returns the IDs of the available scooters, in alphabetical order.
- `charge_all` calls `charge` on every scooter.
