--- meta
{
  "title": "Build a Linked List", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Linked lists", "points": 20, "track": "structures", "specRef": "1.4.2", "contest": "structures-derby",
  "functionName": "LinkedList",
  "tests": [
    { "steps": [["LinkedList"], ["add", "a"], ["add", "b"], ["to_list"], ["contains", "b"], ["contains", "z"]], "expected": [1, 2, ["a", "b"], true, false] },
    { "steps": [["LinkedList"], ["to_list"], ["remove", "x"]], "expected": [[], false] },
    { "steps": [["LinkedList"], ["add", 1], ["add", 2], ["add", 3], ["remove", 2], ["to_list"], ["remove", 2]], "expected": [1, 2, 3, true, [1, 3], false] },
    { "steps": [["LinkedList"], ["add", 1], ["add", 2], ["remove", 1], ["to_list"], ["add", 5], ["to_list"]], "expected": [1, 2, true, [2], 2, [2, 5]], "hidden": true },
    { "steps": [["LinkedList"], ["add", 1], ["add", 2], ["remove", 2], ["add", 3], ["to_list"]], "expected": [1, 2, true, 2, [1, 3]], "hidden": true },
    { "steps": [["LinkedList"], ["add", 7], ["add", 7], ["remove", 7], ["to_list"], ["contains", 7]], "expected": [1, 2, true, [7], true], "hidden": true },
    { "steps": [["LinkedList"], ["add", "only"], ["remove", "only"], ["to_list"], ["contains", "only"], ["add", "new"], ["to_list"]], "expected": [1, true, [], false, 1, ["new"]], "hidden": true }
  ]
}
--- description
A linked list stores each item in a **node**. Every node holds its data and a pointer to the next node; the list itself only remembers the first node, the **head**.

Complete the class `LinkedList`, which starts empty.

| Method | What it does |
| --- | --- |
| `add(item)` | Adds `item` in a new node at the **end** of the list. Returns the new number of items. |
| `remove(item)` | Removes the first node holding `item`. Returns `True`, or `False` if it was not found. |
| `contains(item)` | Returns `True` if any node holds `item`. |
| `to_list()` | Returns the items as an ordinary Python list, from head to end. |

The `Node` class is written for you.

### Example

```python
linked_list = LinkedList()
linked_list.add("a")        # 1
linked_list.add("b")        # 2
linked_list.to_list()       # ["a", "b"]
linked_list.remove("a")     # True
linked_list.to_list()       # ["b"]
```

### Watch out

Removing the head is a special case: there is no previous node whose pointer needs changing.
--- hints
- To add at the end, walk along with `current = current.next` until `current.next` is `None`. An empty list is a special case: the new node becomes the head.
- To remove, walk along keeping the `previous` node as well. Unlink with `previous.next = current.next`, or with `self.head = current.next` when the node to remove is the head.
--- starter
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add(self, item):
        pass

    def remove(self, item):
        pass

    def contains(self, item):
        pass

    def to_list(self):
        pass
--- solution
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add(self, item):
        node = Node(item)
        count = 1
        if self.head is None:
            self.head = node
            return count
        current = self.head
        count += 1
        while current.next is not None:
            current = current.next
            count += 1
        current.next = node
        return count

    def remove(self, item):
        previous = None
        current = self.head
        while current is not None:
            if current.data == item:
                if previous is None:
                    self.head = current.next
                else:
                    previous.next = current.next
                return True
            previous = current
            current = current.next
        return False

    def contains(self, item):
        current = self.head
        while current is not None:
            if current.data == item:
                return True
            current = current.next
        return False

    def to_list(self):
        items = []
        current = self.head
        while current is not None:
            items.append(current.data)
            current = current.next
        return items
