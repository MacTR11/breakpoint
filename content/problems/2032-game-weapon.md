--- meta
{"title": "Adventure game (b): inheritance", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Inheritance", "points": 30, "track": "exam", "specRef": "1.2.4", "functionName": "Weapon",
  "tests": [
    {"steps": [["Weapon", "Sword", 50, 12], ["get_name"], ["get_value"], ["get_damage"], ["describe"]], "expected": ["Sword", 50, 12, "Sword (value 50, damage 12)"]},
    {"steps": [["Weapon", "Stick", 0, 1], ["describe"], ["get_damage"]], "expected": ["Stick (value 0, damage 1)", 1]},
    {"steps": [["Weapon", "Bow", 35, 8], ["get_value"], ["describe"], ["get_name"]], "expected": [35, "Bow (value 35, damage 8)", "Bow"], "hidden": true},
    {"steps": [["Weapon", "Magic Staff", 120, 40], ["describe"], ["get_damage"], ["get_value"]], "expected": ["Magic Staff (value 120, damage 40)", 40, 120], "hidden": true}
  ]
}
--- description
In the adventure game, things a player can pick up are objects of the class `Item`. The class has already been written, and is in the editor.

A weapon is an item that also has a `damage` value.

Write the class `Weapon`, which **inherits** from `Item`, with:

- a constructor `Weapon(name, value, damage)`. It must use the constructor of `Item` to store the name and value, and store the damage in a private attribute.
- `get_damage()`, which returns the damage
- `describe()`, which **overrides** the method in `Item`. For a sword worth 50 with damage 12 it returns `"Sword (value 50, damage 12)"`.

Do not change the class `Item`.

**[6 marks]**
--- hints
- The first line of the class is `class Weapon(Item):`. Inside its constructor, `super().__init__(name, value)` runs the constructor of `Item`.
- `Weapon` cannot read `Item`'s private attributes directly, so `describe` should use `self.get_name()` and `self.get_value()`.
--- starter
class Item:
    def __init__(self, name, value):
        self.__name = name
        self.__value = value

    def get_name(self):
        return self.__name

    def get_value(self):
        return self.__value

    def describe(self):
        return self.__name + " (value " + str(self.__value) + ")"


class Weapon(Item):
    pass
--- solution
class Item:
    def __init__(self, name, value):
        self.__name = name
        self.__value = value

    def get_name(self):
        return self.__name

    def get_value(self):
        return self.__value

    def describe(self):
        return self.__name + " (value " + str(self.__value) + ")"


class Weapon(Item):
    def __init__(self, name, value, damage):
        super().__init__(name, value)
        self.__damage = damage

    def get_damage(self):
        return self.__damage

    def describe(self):
        return self.get_name() + " (value " + str(self.get_value()) + ", damage " + str(self.__damage) + ")"
--- explanation
One mark each, up to 6:

- The class header shows that `Weapon` inherits from `Item`.
- The constructor takes all three parameters.
- The constructor calls the parent constructor with the name and value.
- The damage is stored in a private attribute, and `get_damage` returns it.
- `describe` is redefined in `Weapon`, using the inherited get methods (not the parent's private attributes).
- `describe` returns the string in exactly the format asked for.
