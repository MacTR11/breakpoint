--- meta
{
  "title": "Little Man Computer", "kind": "CODE", "difficulty": "HARD", "topic": "Assembly language", "points": 50, "track": "algorithms", "specRef": "1.2.4",
  "functionName": "run_lmc",
  "tests": [
    { "args": [["INP", "STA 6", "INP", "ADD 6", "OUT", "HLT", "DAT 0"], [3, 4]], "expected": [7] },
    { "args": [["INP", "OUT", "SUB 5", "BRP 1", "HLT", "DAT 1"], [3]], "expected": [3, 2, 1, 0] },
    { "args": [["HLT"], []], "expected": [] },
    { "args": [["LDA 4", "OUT", "OUT", "HLT", "DAT 42"], []], "expected": [42, 42], "hidden": true },
    { "args": [["INP", "STA 11", "INP", "STA 12", "SUB 11", "BRP 8", "LDA 11", "BRA 9", "LDA 12", "OUT", "HLT", "DAT 0", "DAT 0"], [5, 9]], "expected": [9], "hidden": true },
    { "args": [["INP", "STA 11", "INP", "STA 12", "SUB 11", "BRP 8", "LDA 11", "BRA 9", "LDA 12", "OUT", "HLT", "DAT 0", "DAT 0"], [9, 5]], "expected": [9], "hidden": true },
    { "args": [["INP", "STA 11", "INP", "STA 12", "SUB 11", "BRP 8", "LDA 11", "BRA 9", "LDA 12", "OUT", "HLT", "DAT 0", "DAT 0"], [4, 4]], "expected": [4], "hidden": true },
    { "args": [["INP", "STA 15", "INP", "STA 16", "LDA 16", "BRZ 12", "SUB 18", "STA 16", "LDA 17", "ADD 15", "STA 17", "BRA 4", "LDA 17", "OUT", "HLT", "DAT 0", "DAT 0", "DAT 0", "DAT 1"], [6, 7]], "expected": [42], "hidden": true },
    { "args": [["INP", "STA 15", "INP", "STA 16", "LDA 16", "BRZ 12", "SUB 18", "STA 16", "LDA 17", "ADD 15", "STA 17", "BRA 4", "LDA 17", "OUT", "HLT", "DAT 0", "DAT 0", "DAT 0", "DAT 1"], [5, 0]], "expected": [0], "hidden": true }
  ]
}
--- description
Write a simulator for the **Little Man Computer**, following the fetch–decode–execute cycle.

Write a function `run_lmc(program, inputs)`.

- `program` is a list of strings. The string at index `n` is the contents of memory address `n`. Labels have already been replaced by addresses.
- `inputs` is the list of numbers the user will type, in order.
- Return the list of numbers the program outputs.

The machine has an **accumulator** and a **program counter**, both starting at 0. Each cycle it fetches the instruction at the address in the program counter, adds 1 to the program counter, then executes the instruction:

| Instruction | Meaning |
| --- | --- |
| `INP` | Put the next input in the accumulator |
| `OUT` | Output the accumulator |
| `LDA n` | Load the contents of address `n` into the accumulator |
| `STA n` | Store the accumulator at address `n` |
| `ADD n` | Add the contents of address `n` to the accumulator |
| `SUB n` | Subtract the contents of address `n` from the accumulator |
| `BRA n` | Branch always: set the program counter to `n` |
| `BRZ n` | Branch to `n` if the accumulator is zero |
| `BRP n` | Branch to `n` if the accumulator is zero or positive |
| `HLT` | Stop |
| `DAT n` | Not an instruction: this address holds the number `n` (`DAT` alone holds 0) |

For this task the accumulator can hold any integer, including negatives.

### Examples

This program adds two inputs:

```
0  INP
1  STA 6
2  INP
3  ADD 6
4  OUT
5  HLT
6  DAT 0
```

`run_lmc(["INP", "STA 6", "INP", "ADD 6", "OUT", "HLT", "DAT 0"], [3, 4])` returns `[7]`

This one counts down from its input to zero:

`run_lmc(["INP", "OUT", "SUB 5", "BRP 1", "HLT", "DAT 1"], [3])` returns `[3, 2, 1, 0]`
--- hints
- Turn the program into a list called `memory`. Keep `DAT` values as numbers and instructions as strings.
- In a loop: read `memory[counter]`, split it into the opcode and the address, add 1 to the counter, then use `if` / `elif` to carry out the instruction. A branch simply sets the counter.
--- starter
def run_lmc(program, inputs):
    # Write your code here
    pass
--- solution
def run_lmc(program, inputs):
    memory = []
    for line in program:
        parts = line.split()
        if parts[0] == "DAT":
            memory.append(int(parts[1]) if len(parts) > 1 else 0)
        else:
            memory.append(line)
    waiting = list(inputs)
    outputs = []
    accumulator = 0
    counter = 0
    while True:
        parts = memory[counter].split()
        opcode = parts[0]
        address = int(parts[1]) if len(parts) > 1 else 0
        counter += 1
        if opcode == "HLT":
            break
        elif opcode == "INP":
            accumulator = waiting.pop(0)
        elif opcode == "OUT":
            outputs.append(accumulator)
        elif opcode == "LDA":
            accumulator = memory[address]
        elif opcode == "STA":
            memory[address] = accumulator
        elif opcode == "ADD":
            accumulator += memory[address]
        elif opcode == "SUB":
            accumulator -= memory[address]
        elif opcode == "BRA":
            counter = address
        elif opcode == "BRZ":
            if accumulator == 0:
                counter = address
        elif opcode == "BRP":
            if accumulator >= 0:
                counter = address
    return outputs
