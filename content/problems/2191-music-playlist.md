--- meta
{"title": "Music app (a): a looping playlist", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Queues as classes", "points": 35, "track": "exam", "specRef": "1.4.2", "functionName": "Playlist",
  "tests": [
    {"steps": [["Playlist"], ["add", "A"], ["add", "B"], ["add", "C"], ["play"], ["play"], ["play"], ["play"], ["length"]], "expected": [null, null, null, "A", "B", "C", "A", 3]},
    {"steps": [["Playlist"], ["play"], ["add", "Solo"], ["play"], ["play"], ["remove", "Solo"], ["play"], ["length"]], "expected": [null, null, "Solo", "Solo", true, null, 0]},
    {"steps": [["Playlist"], ["add", "A"], ["add", "B"], ["add", "A"], ["length"], ["remove", "B"], ["remove", "B"], ["play"], ["play"]], "expected": [null, null, null, 3, true, false, "A", "A"], "hidden": true},
    {"steps": [["Playlist"], ["add", "X"], ["add", "Y"], ["play"], ["add", "Z"], ["play"], ["play"], ["play"]], "expected": [null, null, "X", null, "Y", "X", "Z"], "hidden": true}
  ]
}
--- description
A music app stores each song as a string holding its title and length, separated by `|`, such as `"Tide|3:45"` for a song of 3 minutes 45 seconds.

The app's playlist plays songs in order, and loops: once a song has played it goes to the back of the queue.

Write the class `Playlist` with:

- a constructor that makes an empty playlist
- `add(song)`, which adds a song to the back
- `play()`, which returns the song at the front and moves it to the back. If the playlist is empty it returns `None`.
- `remove(song)`, which removes the first copy of the song and returns `True`, or returns `False` if it is not there
- `length()`, which returns the number of songs.

The songs are just names here, such as `"A"`.

**[7 marks]**
--- hints
- A list can be the queue: append adds to the back, and `pop(0)` takes from the front.
- `play` takes the front song off, appends it straight back on, and returns it.
--- starter
class Playlist:
    def __init__(self):
        pass
--- solution
class Playlist:
    def __init__(self):
        self.__songs = []

    def add(self, song):
        self.__songs.append(song)

    def play(self):
        if len(self.__songs) == 0:
            return None
        song = self.__songs.pop(0)
        self.__songs.append(song)
        return song

    def remove(self, song):
        if song not in self.__songs:
            return False
        self.__songs.remove(song)
        return True

    def length(self):
        return len(self.__songs)
--- explanation
One mark each, up to 7:

- The constructor makes an empty, private collection of songs.
- `add` puts the song at the back.
- `play` returns `None` for an empty playlist.
- `play` takes the song from the front.
- `play` puts that song at the back and returns it.
- `remove` removes the first copy and returns `True`, or returns `False` when it is missing.
- `length` returns the number of songs.
