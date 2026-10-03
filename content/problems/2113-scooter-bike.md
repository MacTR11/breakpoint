--- meta
{"title": "Scooter hire (c): electric bikes", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Inheritance", "points": 30, "track": "exam", "specRef": "1.2.4", "functionName": "ElectricBike",
  "tests": [
    {"steps": [["ElectricBike", "B1"], ["ride", 30], ["get_battery"], ["is_available"], ["get_id"]], "expected": [true, 70, true, "B1"]},
    {"steps": [["ElectricBike", "B2"], ["ride", 85], ["get_battery"], ["is_available"], ["ride", 6], ["get_battery"]], "expected": [true, 15, true, true, 9]},
    {"steps": [["ElectricBike", "B3"], ["ride", 95], ["is_available"], ["ride", 5], ["is_available"], ["ride", 1]], "expected": [true, false, true, false, false], "hidden": true},
    {"steps": [["ElectricBike", "B4"], ["ride", 100], ["get_battery"], ["charge"], ["get_battery"]], "expected": [true, 0, null, 100], "hidden": true}
  ]
}
--- description
A town runs a fleet of electric scooters. Each scooter has an ID and a battery that is a whole-number percentage, starting at 100. Riding uses 2% of the battery for every minute.

The fleet is adding electric bikes. A bike is like a scooter, except that riding uses only 1% of the battery per minute, and a bike counts as available while its battery is at least 10.

The class `Scooter` is in the editor. Write the class `ElectricBike`, which **inherits** from `Scooter` and **overrides** `ride` and `is_available`. Everything else must be inherited.

`Scooter`'s battery is private, so you will need a way for `ElectricBike` to change it. You may add one protected method to `Scooter` to do this, but its behaviour must not change.

**[6 marks]**
--- hints
- Add a method to `Scooter` such as `_use(amount)` that takes `amount` off the battery. Both classes' `ride` methods can then use it.
- `ElectricBike.ride` compares `minutes` (1% a minute) with `self.get_battery()`, and `is_available` compares the battery with 10.
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


class ElectricBike(Scooter):
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

    def _use(self, amount):
        self.__battery = self.__battery - amount

    def ride(self, minutes):
        cost = minutes * 2
        if cost > self.__battery:
            return False
        self._use(cost)
        return True

    def charge(self):
        self.__battery = 100

    def is_available(self):
        return self.__battery >= 20


class ElectricBike(Scooter):
    def ride(self, minutes):
        if minutes > self.get_battery():
            return False
        self._use(minutes)
        return True

    def is_available(self):
        return self.get_battery() >= 10
--- explanation
One mark each, up to 6:

- The class header shows `ElectricBike` inheriting from `Scooter`.
- The constructor, `get_id`, `get_battery` and `charge` are inherited, not rewritten.
- `ride` is overridden to use 1% per minute.
- `ride` refuses a ride the battery cannot cover, without changing it.
- The battery is changed through a method (or a protected attribute), not by reaching into `Scooter`'s private attribute.
- `is_available` is overridden to compare with 10.
