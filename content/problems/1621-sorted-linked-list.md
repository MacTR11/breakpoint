--- meta
{"title": "A linked list that stays sorted", "kind": "CODE", "difficulty": "HARD", "topic": "Linked lists", "points": 50, "track": "structures", "specRef": "1.4.2", "functionName": "SortedList",
  "tests": [
    {"steps": [["SortedList"], ["add", 5], ["add", 2], ["add", 9], ["add", 4], ["to_list"], ["length"]], "expected": [null, null, null, null, [2, 4, 5, 9], 4]},
    {"steps": [["SortedList"], ["to_list"], ["remove", 3], ["add", 1], ["remove", 1], ["to_list"]], "expected": [[], false, null, true, []]},
    {"steps": [["SortedList"], ["add", 3], ["add", 3], ["add", 1], ["remove", 3], ["to_list"], ["contains", 3], ["contains", 7]], "expected": [null, null, null, true, [1, 3], true, false], "hidden": true},
    {"steps": [["SortedList"], ["add", 8], ["add", 6], ["add", 7], ["remove", 8], ["remove", 6], ["to_list"], ["length"]], "expected": [null, null, null, true, true, [7], 1], "hidden": true}
  ]
}
--- description
A linked list is made of nodes, each holding an item and a pointer to the next node. Write the class `SortedList`, a linked list that always keeps its items in ascending order, with:

- a constructor that makes an empty list
- `add(item)`, which puts the item in its correct place
- `remove(item)`, which removes the first node holding the item and returns `True`, or returns `False` if it is not there
- `contains(item)`, which returns `True` or `False`
- `length()`, which returns the number of items
- `to_list()`, which returns the items, in order, as an ordinary Python list.

Use nodes linked by pointers: you may use a Python list only to build the result of `to_list`.
--- hints
- Write a small `Node` class with `item` and `next` attributes. The list itself keeps `self.head`, which is `None` when empty.
- To add: if the list is empty, or the new item is smaller than the head's, the new node becomes the head. Otherwise walk along until the next node's item is not smaller, and link the new node in there.
- To remove: deal with the head separately, then walk along looking one node ahead, and skip over the node to remove with `current.next = current.next.next`.
--- starter
class SortedList:
    def __init__(self):
        pass
--- solution
class Node:
    def __init__(self, item):
        self.item = item
        self.next = None


class SortedList:
    def __init__(self):
        self.head = None

    def add(self, item):
        node = Node(item)
        if self.head is None or item < self.head.item:
            node.next = self.head
            self.head = node
            return
        current = self.head
        while current.next is not None and current.next.item < item:
            current = current.next
        node.next = current.next
        current.next = node

    def remove(self, item):
        if self.head is None:
            return False
        if self.head.item == item:
            self.head = self.head.next
            return True
        current = self.head
        while current.next is not None:
            if current.next.item == item:
                current.next = current.next.next
                return True
            current = current.next
        return False

    def contains(self, item):
        current = self.head
        while current is not None:
            if current.item == item:
                return True
            current = current.next
        return False

    def length(self):
        count = 0
        current = self.head
        while current is not None:
            count = count + 1
            current = current.next
        return count

    def to_list(self):
        items = []
        current = self.head
        while current is not None:
            items.append(current.item)
            current = current.next
        return items
