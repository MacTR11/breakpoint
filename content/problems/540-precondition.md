--- meta
{ "title": "Precondition", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Thinking ahead", "points": 5, "track": "searching", "specRef": "2.1.2",
  "options": ["The list must be sorted", "The list must contain only numbers", "The list must have an even number of items", "The list must contain no duplicates"], "answer": 0 }
--- description
A precondition is something that must be true before a piece of code is used, for it to work correctly.

What is the precondition for a **binary search**?
--- hints
- Think about how binary search decides which half of the list to throw away.
--- explanation
Binary search decides which half of the list to throw away by comparing the target with the middle item. That only works if **the list is sorted**: otherwise the target could be hiding in the half that was discarded.

Stating preconditions is part of *thinking ahead*. It tells whoever reuses the code what they must guarantee, and saves the code from re-checking it every time.
