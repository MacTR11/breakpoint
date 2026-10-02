--- meta
{"title": "Why Does It Never Stop?", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Infinite loop", "points": 5, "track": "debugging", "specRef": "3.3", "options": ["`count` moves away from 0, so the condition is always true", "`print` cannot be used inside a `while` loop", "The condition should be `count >= 0`", "`count` is never given a starting value"], "answer": 0}
--- description
This program is meant to count down from 10 to 1 and then stop.

```python
count = 10
while count > 0:
    print(count)
    count = count + 1
```

Instead it prints numbers for ever. Why?
--- hints
- What are the first three numbers it prints?
--- explanation
The loop carries on while `count > 0`. Each time round, `count` goes **up** by 1 (10, 11, 12 and so on), so it gets further from 0 and the condition can never become false.

The last line should be `count = count - 1`.

For every `while` loop, ask: what changes inside the loop that will eventually make the condition false?
