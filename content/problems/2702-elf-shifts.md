--- meta
{"contest": "winter-cracker", "title": "Elf shifts", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Arithmetic", "points": 25, "track": "basics", "specRef": "2.2.1", "functionName": "elf_shifts",
  "tests": [
    {"args": [10, 3], "expected": [4, 3, 3]},
    {"args": [12, 4], "expected": [3, 3, 3, 3]},
    {"args": [2, 5], "expected": [1, 1, 0, 0, 0]},
    {"args": [7, 1], "expected": [7], "hidden": true},
    {"args": [0, 2], "expected": [0, 0], "hidden": true},
    {"args": [23, 6], "expected": [4, 4, 4, 4, 4, 3], "hidden": true}
  ]
}
--- description
The workshop needs `hours` hours of wrapping done, shared between `elves` elves as evenly as possible. Every elf works a whole number of hours. When the hours do not share out exactly, the first elves in the list each do one extra hour.

Write `elf_shifts(hours, elves)`, which returns a list of how many hours each elf works. For example `elf_shifts(10, 3)` is `[4, 3, 3]`.
--- hints
- `hours // elves` is what everyone does at least. `hours % elves` is how many hours are left over.
- The first `hours % elves` elves each get one more than the rest.
--- starter
def elf_shifts(hours, elves):
    # Write your code here
    pass
--- solution
def elf_shifts(hours, elves):
    base = hours // elves
    extra = hours % elves
    shifts = []
    for i in range(elves):
        if i < extra:
            shifts.append(base + 1)
        else:
            shifts.append(base)
    return shifts
