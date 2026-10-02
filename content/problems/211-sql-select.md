--- meta
{
  "title": "SELECT … WHERE in Python", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Databases", "points": 20, "track": "lists", "specRef": "1.3.2",
  "functionName": "select",
  "tests": [
    { "args": [[{ "name": "Amira", "year": 12, "house": "Stanley" }, { "name": "Ben", "year": 13, "house": "Stanley" }, { "name": "Chloe", "year": 12, "house": "Fylde" }], ["name"], "year", 12], "expected": [{ "name": "Amira" }, { "name": "Chloe" }] },
    { "args": [[{ "name": "Amira", "year": 12, "house": "Stanley" }, { "name": "Ben", "year": 13, "house": "Stanley" }, { "name": "Chloe", "year": 12, "house": "Fylde" }], ["name", "house"], "house", "Stanley"], "expected": [{ "name": "Amira", "house": "Stanley" }, { "name": "Ben", "house": "Stanley" }] },
    { "args": [[{ "name": "Amira", "year": 12, "house": "Stanley" }], ["year"], "name", "Zed"], "expected": [] },
    { "args": [[], ["a"], "a", 1], "expected": [], "hidden": true },
    { "args": [[{ "name": "Amira", "year": 12, "house": "Stanley" }, { "name": "Ben", "year": 13, "house": "Stanley" }], ["house", "year", "name"], "name", "Ben"], "expected": [{ "house": "Stanley", "year": 13, "name": "Ben" }], "hidden": true },
    { "args": [[{ "id": 1, "ok": true }, { "id": 2, "ok": false }, { "id": 3, "ok": true }], ["id"], "ok", true], "expected": [{ "id": 1 }, { "id": 3 }], "hidden": true }
  ]
}
--- description
In SQL, this query picks certain fields from the records that match a condition:

```sql
SELECT name, house
FROM students
WHERE year = 12
```

Write a function `select(records, fields, where_field, where_value)` that does the same job on a list of dictionaries.

- `records` is the table: a list of dictionaries that all have the same keys.
- Keep only the records where `record[where_field]` equals `where_value`.
- For each one kept, return a new dictionary containing only the keys listed in `fields`.
- Keep the records in their original order.

### Example

```python
students = [
    {"name": "Amira", "year": 12, "house": "Stanley"},
    {"name": "Ben",   "year": 13, "house": "Stanley"},
    {"name": "Chloe", "year": 12, "house": "Fylde"},
]
select(students, ["name"], "year", 12)
```

returns `[{"name": "Amira"}, {"name": "Chloe"}]`
--- hints
- Loop through the records and keep those where `record[where_field] == where_value`.
- For each one you keep, build a new dictionary by looping through `fields`: `row[field] = record[field]`.
--- starter
def select(records, fields, where_field, where_value):
    # Write your code here
    pass
--- solution
def select(records, fields, where_field, where_value):
    result = []
    for record in records:
        if record[where_field] == where_value:
            row = {}
            for field in fields:
                row[field] = record[field]
            result.append(row)
    return result
