--- meta
{ "title": "Three Switches", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Boolean logic", "points": 10, "track": "basics", "specRef": "1.4.3",
  "options": ["3", "4", "5", "6"], "answer": 2 }
--- description
A lamp is controlled by three switches, **A**, **B** and **C**. Each switch is either on or off. The lamp lights up when this is true:

```
(A AND NOT B) OR C
```

There are 8 different ways to set the three switches. For **how many** of them is the lamp lit?
--- hints
- If C is on, the lamp is lit whatever A and B are. How many of the 8 settings is that?
- Now count the settings with C off where `A AND NOT B` is true.
--- explanation
Whenever **C is on** the lamp is lit, whatever A and B are doing. That covers 4 of the 8 settings.

When **C is off**, the lamp needs `A AND NOT B`, which is only true when A is on and B is off. That is 1 more setting.

4 + 1 = **5**. Writing out all 8 rows of the truth table gives the same answer.
