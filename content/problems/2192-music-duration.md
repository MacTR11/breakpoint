--- meta
{"title": "Music app (b): the playlist's length", "kind": "CODE", "difficulty": "MEDIUM", "topic": "String handling", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "total_length",
  "tests": [
    {"args": [["Tide|3:45", "Pier|2:30", "Sands|4:05"]], "expected": "10:20"},
    {"args": [[]], "expected": "0:00"},
    {"args": [["Long|59:59", "Short|0:02"]], "expected": "60:01"},
    {"args": [["A|1:00", "B|1:00", "C|1:00"]], "expected": "3:00", "hidden": true},
    {"args": [["Epic|12:34"]], "expected": "12:34", "hidden": true}
  ]
}
--- description
A music app stores each song as a string holding its title and length, separated by `|`, such as `"Tide|3:45"` for a song of 3 minutes 45 seconds.

Write the function `total_length(songs)`, which returns the total length of a list of songs as a string in the form `"m:ss"`: minutes, a colon, then the seconds with two digits.

For example, `total_length(["Tide|3:45", "Pier|2:30", "Sands|4:05"])` returns `"10:20"`. An empty list gives `"0:00"`.

**[5 marks]**
--- hints
- Split each song at `|` to get the length, then split the length at `:` to get minutes and seconds. Add everything up in seconds.
- At the end, the minutes are `total // 60` and the seconds `total % 60`. Give the seconds a leading zero when they are under 10.
--- starter
def total_length(songs):
    pass
--- solution
def total_length(songs):
    total = 0
    for song in songs:
        length = song.split("|")[1]
        minutes, seconds = length.split(":")
        total = total + int(minutes) * 60 + int(seconds)
    seconds = total % 60
    return str(total // 60) + ":" + ("0" if seconds < 10 else "") + str(seconds)
--- explanation
One mark each, up to 5:

- Separates each song's length from its title.
- Separates the minutes and the seconds and converts them to integers.
- Adds up the total length in seconds.
- Converts the total back to minutes and seconds with `DIV` and `MOD`.
- Returns the string in the right form, with the seconds always two digits.
