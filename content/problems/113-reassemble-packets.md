--- meta
{
  "title": "Packet reassembly", "kind": "CODE", "difficulty": "EASY", "topic": "Networks", "points": 10, "track": "lists", "specRef": "1.3.3",
  "functionName": "reassemble",
  "tests": [
    { "args": [[[2, "lo"], [1, "hel"]]], "expected": "hello" },
    { "args": [[[1, "A"]]], "expected": "A" },
    { "args": [[]], "expected": "" },
    { "args": [[[3, "!"], [1, "Hi "], [2, "there"]]], "expected": "Hi there!", "hidden": true },
    { "args": [[[10, "b"], [2, "a"]]], "expected": "ab", "hidden": true },
    { "args": [[[4, "d"], [3, "c"], [2, "b"], [1, "a"]]], "expected": "abcd", "hidden": true }
  ]
}
--- description
With packet switching, a message is split into packets that may travel by different routes and arrive **out of order**. Each packet carries a sequence number so the receiver can put the message back together.

Write a function `reassemble(packets)`. Each packet is a list `[sequence_number, data]`. Return the complete message: the data from every packet, joined in order of sequence number.

Sequence numbers are all different, but they do not have to start at 1 or go up in ones.

### Examples

| Call | Returns |
| --- | --- |
| `reassemble([[2, "lo"], [1, "hel"]])` | `"hello"` |
| `reassemble([])` | `""` |
--- hints
- The packets need putting in order of their sequence number, which is the first item of each packet.
- `sorted(packets)` orders lists by their first item. Then join the second item of each packet onto a string.
--- starter
def reassemble(packets):
    # Write your code here
    pass
--- solution
def reassemble(packets):
    message = ""
    for packet in sorted(packets):
        message += packet[1]
    return message
