--- meta
{"title": "Timetable (b): how long is the journey?", "kind": "CODE", "difficulty": "EASY", "topic": "Arithmetic", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "journey_time",
  "tests": [
    {"args": ["07:45", "09:10"], "expected": 85},
    {"args": ["23:30", "00:15"], "expected": 45},
    {"args": ["12:00", "12:00"], "expected": 0},
    {"args": ["00:01", "23:59"], "expected": 1438, "hidden": true},
    {"args": ["22:00", "01:30"], "expected": 210, "hidden": true}
  ]
}
--- description
A station shows train times as strings in the 24-hour form `"HH:MM"`, such as `"07:45"` or `"23:10"`.

Write the function `journey_time(depart, arrive)`, which returns the length of a journey in minutes. A journey is always under 24 hours, so an arrival time earlier than the departure time means the train arrived the next day. Equal times mean a journey of 0 minutes.

For example, `journey_time("23:30", "00:15")` returns `45`.

You may use your function from part (a); if you do, include it in your answer.

**[4 marks]**
--- hints
- Turn both times into minutes since midnight and subtract.
- If the answer is negative, the journey passed midnight: add 24 × 60.
--- starter
def journey_time(depart, arrive):
    pass
--- solution
def to_minutes(time):
    hours, minutes = time.split(":")
    return int(hours) * 60 + int(minutes)

def journey_time(depart, arrive):
    minutes = to_minutes(arrive) - to_minutes(depart)
    if minutes < 0:
        minutes = minutes + 24 * 60
    return minutes
--- explanation
One mark each, up to 4:

- Converts both times to minutes (for example with part (a)).
- Subtracts the departure from the arrival.
- Adds a day's minutes when the journey passes midnight.
- Returns the number of minutes.
