--- meta
{"title": "A thermostat", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Classes and validation", "points": 25, "track": "oop", "specRef": "1.2.4", "functionName": "Thermostat",
  "tests": [
    {"steps": [["Thermostat", 18], ["get_current"], ["set_target", 21], ["tick"], ["tick"], ["tick"], ["tick"]], "expected": [18, true, 19, 20, 21, 21]},
    {"steps": [["Thermostat", 20], ["set_target", 35], ["set_target", 4], ["get_target"], ["set_target", 17], ["tick"], ["tick"], ["tick"], ["tick"]], "expected": [false, false, 20, true, 19, 18, 17, 17]},
    {"steps": [["Thermostat", 22], ["tick"], ["get_target"]], "expected": [22, 22], "hidden": true},
    {"steps": [["Thermostat", 10], ["set_target", 5], ["tick"], ["set_target", 30], ["tick"], ["get_current"]], "expected": [true, 9, true, 10, 10], "hidden": true}
  ]
}
--- description
A heating system has a current temperature and a target temperature, both whole numbers of degrees.

Write the class `Thermostat` with:

- a constructor `Thermostat(current)`, which sets the current temperature and makes the target the same
- `get_current()` and `get_target()`
- `set_target(degrees)`, which changes the target and returns `True` if `degrees` is between 5 and 30 inclusive. Any other value is refused: the target stays as it was and the method returns `False`.
- `tick()`, called once a minute. It moves the current temperature 1 degree towards the target (or leaves it alone if they are equal), then returns the current temperature.
--- hints
- Check the range in `set_target` before changing anything: `if 5 <= degrees <= 30:`.
- `tick` has three cases: below the target (add 1), above it (subtract 1), or already there (do nothing). Return the current temperature in every case.
--- starter
class Thermostat:
    def __init__(self, current):
        pass
--- solution
class Thermostat:
    def __init__(self, current):
        self.current = current
        self.target = current

    def get_current(self):
        return self.current

    def get_target(self):
        return self.target

    def set_target(self, degrees):
        if 5 <= degrees <= 30:
            self.target = degrees
            return True
        return False

    def tick(self):
        if self.current < self.target:
            self.current = self.current + 1
        elif self.current > self.target:
            self.current = self.current - 1
        return self.current
