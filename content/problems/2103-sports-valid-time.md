--- meta
{"title": "Sports day (c): validate a race time", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Validation", "points": 30, "track": "exam", "specRef": "2.2.1", "functionName": "valid_time",
  "tests": [
    {"args": ["01:23.45"], "expected": true},
    {"args": ["1:23.45"], "expected": false},
    {"args": ["01:60.00"], "expected": false},
    {"args": ["01:23,45"], "expected": false},
    {"args": ["ab:cd.ef"], "expected": false, "hidden": true},
    {"args": ["00:00.00"], "expected": true, "hidden": true},
    {"args": ["59:59.99"], "expected": true, "hidden": true},
    {"args": ["01:23.4"], "expected": false, "hidden": true},
    {"args": ["01:23.456"], "expected": false, "hidden": true},
    {"args": [""], "expected": false, "hidden": true},
    {"args": ["12:34:56"], "expected": false, "hidden": true}
  ]
}
--- description
Race times are typed in as strings in the form `mm:ss.hh`: two digits of minutes, a colon, two digits of seconds, a full stop and two digits of hundredths. For example `"01:23.45"` is one minute, 23.45 seconds.

Write the function `valid_time(text)`, which returns `True` only if the text is in exactly that form and the seconds are less than 60. Otherwise it returns `False`. It must never crash.

**[6 marks]**
--- hints
- Check the length (8 characters) and that the characters at index 2 and 5 are `:` and `.` before looking at anything else.
- The minutes, seconds and hundredths are then `text[0:2]`, `text[3:5]` and `text[6:8]`. Each must be all digits, and the seconds less than 60.
--- starter
def valid_time(text):
    pass
--- solution
def valid_time(text):
    if len(text) != 8 or text[2] != ":" or text[5] != ".":
        return False
    minutes = text[0:2]
    seconds = text[3:5]
    hundredths = text[6:8]
    if not (minutes.isdigit() and seconds.isdigit() and hundredths.isdigit()):
        return False
    return int(seconds) < 60
--- explanation
One mark each, up to 6:

- Checks the length is exactly 8.
- Checks the colon and the full stop are in the right places.
- Extracts the minutes, seconds and hundredths.
- Checks each part is made only of digits, before converting any of them.
- Checks the seconds are less than 60.
- Returns `True` only when every check passes, and never crashes on short or odd input.
