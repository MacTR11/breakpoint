--- meta
{"title": "Halve and remember", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Tracing recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "check": "run", "options": ["1011", "1101", "11", "0111"], "answer": 0}
--- description
```python
def f(n):
    if n == 0:
        return ""
    return f(n // 2) + str(n % 2)

print(f(11))
```

What does this program print?
--- hints
- Write down each call: `f(11)` calls `f(5)`, which calls `f(2)`, and so on down to `f(0)`.
- Each call adds its own digit **after** the result of the call it made, so the digits come out in the order the calls finish.
--- explanation
| call | `n % 2` | returns |
| --- | --- | --- |
| `f(0)` | | `""` |
| `f(1)` | 1 | `"1"` |
| `f(2)` | 0 | `"10"` |
| `f(5)` | 1 | `"101"` |
| `f(11)` | 1 | `"1011"` |

It is the binary form of 11: `1011`.
