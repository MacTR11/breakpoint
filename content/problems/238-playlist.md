--- meta
{"title": "Playlist", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Class design", "points": 25, "track": "oop", "specRef": "1.2.4", "functionName": "Playlist",
  "tests": [
    {"steps": [["Playlist"], ["add", "Intro", 60], ["add", "Anthem", 240], ["total_time"], ["longest"]], "expected": [1, 2, 300, "Anthem"]},
    {"steps": [["Playlist"], ["total_time"], ["longest"], ["remove", "x"]], "expected": [0, null, false]},
    {"steps": [["Playlist"], ["add", "A", 100], ["add", "B", 100], ["longest"], ["remove", "A"], ["longest"], ["total_time"]], "expected": [1, 2, "A", true, "B", 100]},
    {"steps": [["Playlist"], ["add", "A", 5], ["remove", "A"], ["remove", "A"], ["total_time"], ["longest"]], "expected": [1, true, false, 0, null], "hidden": true},
    {"steps": [["Playlist"], ["add", "x", 1], ["add", "y", 9], ["add", "z", 4], ["remove", "y"], ["longest"], ["total_time"]], "expected": [1, 2, 3, true, "z", 5], "hidden": true}
  ]
}
--- description
Write a class `Playlist`, which starts with no tracks.

| Method | What it does |
| --- | --- |
| `add(title, seconds)` | Adds a track to the end. Returns the new number of tracks. |
| `remove(title)` | Removes the track with that title. Returns `True`, or `False` if there is no such track. |
| `total_time()` | Returns the total length of all the tracks, in seconds. |
| `longest()` | Returns the **title** of the longest track. If several are equally long, the one added first. Returns `None` if the playlist is empty. |

Titles are all different.

### Example

```python
playlist = Playlist()
playlist.add("Intro", 60)      # 1
playlist.add("Anthem", 240)    # 2
playlist.total_time()          # 300
playlist.longest()             # "Anthem"
```
--- hints
- Store the tracks in a list, each as a small list `[title, seconds]`, so that they stay in the order they were added.
- For `longest`, go through the tracks remembering the best so far, and only replace it when a track is **strictly** longer. That keeps the earlier track on a tie.
--- starter
class Playlist:
    def __init__(self):
        # Decide what to store here
        pass

    def add(self, title, seconds):
        pass

    def remove(self, title):
        pass

    def total_time(self):
        pass

    def longest(self):
        pass
--- solution
class Playlist:
    def __init__(self):
        self.tracks = []

    def add(self, title, seconds):
        self.tracks.append([title, seconds])
        return len(self.tracks)

    def remove(self, title):
        for track in self.tracks:
            if track[0] == title:
                self.tracks.remove(track)
                return True
        return False

    def total_time(self):
        total = 0
        for track in self.tracks:
            total += track[1]
        return total

    def longest(self):
        best = None
        for track in self.tracks:
            if best is None or track[1] > best[1]:
                best = track
        return None if best is None else best[0]
