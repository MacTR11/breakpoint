--- meta
{"title": "A digital clock", "kind": "CODE", "difficulty": "EASY", "topic": "Classes", "points": 10, "track": "oop", "specRef": "1.2.4", "functionName": "Clock",
  "tests": [
    {"steps": [["Clock", 9, 5], ["show"], ["tick", 10], ["show"]], "expected": ["09:05", null, "09:15"]},
    {"steps": [["Clock", 23, 58], ["tick", 3], ["show"]], "expected": [null, "00:01"]},
    {"steps": [["Clock", 0, 0], ["show"], ["tick", 1440], ["show"], ["tick", 61], ["show"]], "expected": ["00:00", null, "00:00", null, "01:01"], "hidden": true},
    {"steps": [["Clock", 12, 30], ["tick", 0], ["show"]], "expected": [null, "12:30"], "hidden": true}
  ]
}
--- description
Write the class `Clock` with:

- a constructor `Clock(hours, minutes)` for a time on the 24-hour clock
- `tick(minutes)`, which moves the time on by that many minutes, wrapping round after midnight
- `show()`, which returns the time as `"HH:MM"`, with two digits each.

For example, a `Clock(23, 58)` that ticks on 3 minutes shows `"00:01"`.
--- hints
- It is easiest to store a single number: minutes since midnight. `tick` adds to it and wraps with `% (24 * 60)`.
- `show` works out the hours and minutes with `//` and `%`. A number below 10 needs a leading 0 (or use an f-string with `:02d`).
--- starter
class Clock:
    def __init__(self, hours, minutes):
        pass
--- solution
class Clock:
    def __init__(self, hours, minutes):
        self.minutes = hours * 60 + minutes

    def tick(self, minutes):
        self.minutes = (self.minutes + minutes) % (24 * 60)

    def show(self):
        hours = self.minutes // 60
        minutes = self.minutes % 60
        return f"{hours:02d}:{minutes:02d}"
