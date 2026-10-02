--- meta
{
  "title": "Bank Account Class", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Encapsulation", "points": 20, "track": "oop", "specRef": "1.2.4",
  "functionName": "BankAccount",
  "tests": [
    { "steps": [["BankAccount", "Sam", 100], ["deposit", 50], ["get_balance"], ["get_owner"]], "expected": [true, 150, "Sam"] },
    { "steps": [["BankAccount", "Ali", 20], ["withdraw", 50], ["get_balance"]], "expected": [false, 20] },
    { "steps": [["BankAccount", "Jo", 0], ["deposit", -5], ["deposit", 0], ["get_balance"]], "expected": [false, false, 0] },
    { "steps": [["BankAccount", "K", 10], ["withdraw", 10], ["get_balance"], ["withdraw", 1]], "expected": [true, 0, false], "hidden": true },
    { "steps": [["BankAccount", "L", 5], ["withdraw", -5], ["withdraw", 0], ["get_balance"]], "expected": [false, false, 5], "hidden": true },
    { "steps": [["BankAccount", "M", 1], ["deposit", 2], ["deposit", 3], ["withdraw", 4], ["get_balance"]], "expected": [true, true, true, 2], "hidden": true }
  ]
}
--- description
**Encapsulation** means an object keeps its data private and only lets other code change it through methods, which can refuse changes that make no sense.

Complete the class `BankAccount`. It is created with an owner's name and an opening balance in pence.

| Method | What it does |
| --- | --- |
| `deposit(amount)` | Adds `amount` to the balance and returns `True`. If `amount` is zero or negative, changes nothing and returns `False`. |
| `withdraw(amount)` | Takes `amount` off the balance and returns `True`. If `amount` is zero or negative, or more than the balance, changes nothing and returns `False`. |
| `get_balance()` | Returns the balance. |
| `get_owner()` | Returns the owner's name. |

### Example

```python
account = BankAccount("Sam", 100)
account.deposit(50)      # True
account.withdraw(500)    # False: not enough money
account.get_balance()    # 150
```
--- hints
- Store the owner and the balance as attributes in `__init__`, for example `self.balance = balance`.
- In `withdraw`, test for every reason to refuse (`amount <= 0 or amount > self.balance`) and return `False` **before** changing the balance.
--- starter
class BankAccount:
    def __init__(self, owner, balance):
        # Store the attributes here
        pass

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass

    def get_balance(self):
        pass

    def get_owner(self):
        pass
--- solution
class BankAccount:
    def __init__(self, owner, balance):
        self.__owner = owner
        self.__balance = balance

    def deposit(self, amount):
        if amount <= 0:
            return False
        self.__balance += amount
        return True

    def withdraw(self, amount):
        if amount <= 0 or amount > self.__balance:
            return False
        self.__balance -= amount
        return True

    def get_balance(self):
        return self.__balance

    def get_owner(self):
        return self.__owner
