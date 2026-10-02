--- meta
{ "title": "The Looping Tram", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Tracing", "points": 5, "track": "basics", "specRef": "2.2.1",
  "options": ["Stop 6", "Stop 8", "Stop 10", "Stop 12"], "answer": 1 }
--- description
A driverless tram starts at **stop 0** and follows this program:

```
repeat 4 times:
    move forward 3 stops
    move back 1 stop
```

Which stop is the tram at when the program finishes?
--- hints
- Work out where the tram is after going round the loop **once**.
--- explanation
Each time round the loop the tram ends up 3 − 1 = **2 stops** further on. The loop runs 4 times, so it finishes at 4 × 2 = **stop 8**.

This is *iteration*: working out what one pass of a loop does, then multiplying up.
