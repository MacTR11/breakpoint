--- meta
{"title": "Adventure game (a): the Player class", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Classes and objects", "points": 35, "track": "exam", "specRef": "1.2.4", "functionName": "Player",
  "tests": [
    {"steps": [["Player", "Mo"], ["get_name"], ["get_health"], ["take_damage", 30], ["get_health"], ["is_alive"]], "expected": ["Mo", 100, null, 70, true]},
    {"steps": [["Player", "Ada"], ["take_damage", 60], ["take_damage", 60], ["get_health"], ["is_alive"], ["add_score", 5], ["get_score"]], "expected": [null, null, 0, false, null, 5]},
    {"steps": [["Player", "Zed"], ["get_score"], ["add_score", 10], ["add_score", 15], ["get_score"], ["take_damage", 100], ["is_alive"], ["get_health"]], "expected": [0, null, null, 25, null, false, 0], "hidden": true},
    {"steps": [["Player", "Kit"], ["take_damage", 0], ["get_health"], ["take_damage", 99], ["is_alive"], ["take_damage", 1], ["is_alive"]], "expected": [null, 100, null, true, null, false], "hidden": true},
    {"steps": [["Player", ""], ["get_name"], ["take_damage", 250], ["get_health"], ["add_score", 0], ["get_score"]], "expected": ["", null, 0, null, 0], "hidden": true}
  ]
}
--- description
A text adventure game is being written using object-oriented programming. Each person playing is represented by an object of the class `Player`.

Write the class `Player` with:

- a constructor `Player(name)` that stores the name, sets the health to 100 and the score to 0. All three attributes must be private.
- `get_name()`, `get_health()` and `get_score()`, which return those values
- `take_damage(amount)`, which reduces the health by `amount`. Health never goes below 0.
- `add_score(points)`, which adds `points` to the score
- `is_alive()`, which returns `True` if the health is above 0 and `False` otherwise.

`take_damage` and `add_score` do not need to return anything.

**[7 marks]**
--- hints
- In Python an attribute is made private by starting its name with two underscores, for example `self.__health = 100`.
- In `take_damage`, subtract first, then check: if the health has gone below 0, set it back to 0.
--- starter
class Player:
    def __init__(self, name):
        pass
--- solution
class Player:
    def __init__(self, name):
        self.__name = name
        self.__health = 100
        self.__score = 0

    def get_name(self):
        return self.__name

    def get_health(self):
        return self.__health

    def get_score(self):
        return self.__score

    def take_damage(self, amount):
        self.__health = self.__health - amount
        if self.__health < 0:
            self.__health = 0

    def add_score(self, points):
        self.__score = self.__score + points

    def is_alive(self):
        return self.__health > 0
--- explanation
One mark each, up to 7:

- Class header, and a constructor that takes the name as a parameter.
- The constructor assigns the name parameter, 100 and 0 to the three attributes.
- The attributes are declared private.
- The three get methods each return the right attribute.
- `take_damage` subtracts the parameter from the health.
- `take_damage` stops the health going below 0.
- `add_score` adds to the score, and `is_alive` returns the correct Boolean.
