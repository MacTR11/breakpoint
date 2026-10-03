--- meta
{"title": "Music app (c): songs for the journey", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Greedy algorithms", "points": 25, "track": "exam", "specRef": "2.2.1", "functionName": "most_songs",
  "tests": [
    {"args": [["Tide|3:45", "Pier|2:30", "Sands|4:05"], 400], "expected": 2},
    {"args": [["Tide|3:45", "Pier|2:30", "Sands|4:05"], 100], "expected": 0},
    {"args": [["Tide|3:45", "Pier|2:30", "Sands|4:05"], 1000], "expected": 3},
    {"args": [[], 60], "expected": 0, "hidden": true},
    {"args": [["A|1:00", "B|1:00", "C|1:00"], 180], "expected": 3, "hidden": true},
    {"args": [["A|5:00", "B|0:30", "C|0:30", "D|2:00"], 200], "expected": 3, "hidden": true}
  ]
}
--- description
A music app stores each song as a string holding its title and length, separated by `|`, such as `"Tide|3:45"` for a song of 3 minutes 45 seconds.

A student has a journey of `seconds` seconds, and wants to hear as many whole songs from a list as possible. Write the function `most_songs(songs, seconds)`, which returns the largest number of songs whose total length fits within the journey. (Choosing the shortest songs first always gives the most.)

For example, with `["Tide|3:45", "Pier|2:30", "Sands|4:05"]` and a journey of 400 seconds, the answer is `2`: Pier and Tide take 375 seconds.

**[5 marks]**
--- hints
- Turn every song into its length in seconds, and sort the lengths from shortest to longest.
- Add songs in that order while they still fit, counting them. Stop at the first song that would go over.
--- starter
def most_songs(songs, seconds):
    pass
--- solution
def most_songs(songs, seconds):
    lengths = []
    for song in songs:
        minutes, secs = song.split("|")[1].split(":")
        lengths.append(int(minutes) * 60 + int(secs))
    used = 0
    count = 0
    for length in sorted(lengths):
        if used + length > seconds:
            break
        used = used + length
        count = count + 1
    return count
--- explanation
One mark each, up to 5:

- Works out each song's length in seconds.
- Sorts the lengths from shortest to longest.
- Adds songs while the running total stays within the journey.
- Stops when the next song would not fit.
- Returns the number of songs.
