--- meta
{ "title": "Divide and Conquer", "kind": "PUZZLE", "difficulty": "EASY", "topic": "Computational methods", "points": 5, "track": "sorting", "specRef": "2.2.2",
  "options": ["Bubble sort", "Linear search", "Insertion sort", "Merge sort"], "answer": 3 }
--- description
A **divide and conquer** algorithm solves a problem by splitting it into smaller versions of the same problem, solving those, and combining the results.

Which of these algorithms is an example?
--- hints
- Which of these splits the list into halves and deals with each half separately?
--- explanation
**Merge sort** splits the list in half, sorts each half by merge sort, then merges the two sorted halves. That is divide, conquer and combine.

Bubble sort, insertion sort and linear search all work their way through the whole list step by step, without ever breaking the problem into smaller copies of itself. Binary search and quick sort are the other divide and conquer algorithms on the course.
