--- meta
{ "title": "Collision Course", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Hash tables", "points": 10, "track": "structures", "specRef": "1.4.2",
  "options": ["Position 1", "Position 2", "Position 3", "Position 4"], "answer": 3 }
--- description
A hash table has 7 positions, numbered 0 to 6, and uses the hash function `key MOD 7`. Collisions are handled by **linear probing**: if a position is taken, try the next one along.

The table starts empty and these keys are inserted in order:

**15, 9, 22, 30**

In which position is **30** stored?
--- hints
- Work out `key MOD 7` for each key in turn, and write the keys into a table with positions 0 to 6.
- If the position is taken, try the next one along, and the next, until one is free.
--- explanation
- 15 MOD 7 = 1, so 15 goes in position 1.
- 9 MOD 7 = 2, so 9 goes in position 2.
- 22 MOD 7 = 1, which is taken. Position 2 is taken too, so 22 goes in position 3.
- 30 MOD 7 = 2, which is taken. Position 3 is taken, so 30 goes in **position 4**.

Notice how the collisions build up into a cluster, making each new insertion slower. A good hash function spreads keys out to avoid this.
