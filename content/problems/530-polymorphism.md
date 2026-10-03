--- meta
{ "title": "Who speaks?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Object-oriented programming", "points": 10, "track": "oop", "specRef": "1.2.4",
  "options": ["...", "Woof", "Nothing is printed", "An error: Puppy has no speak method"], "answer": 1 }
--- description
```
class Animal
    public procedure speak()
        print("...")
    endprocedure
endclass

class Dog inherits Animal
    public procedure speak()
        print("Woof")
    endprocedure
endclass

class Puppy inherits Dog
endclass

pet = new Puppy()
pet.speak()
```

What is printed?
--- hints
- `Puppy` has no methods of its own, so look in the class it inherits from.
- When a child class defines a method with the same name as its parent's, the child's version is the one used.
--- explanation
`Puppy` defines no methods of its own, so it **inherits** everything from its parent class, `Dog`.

`Dog` has its own `speak` method, which **overrides** the one it inherited from `Animal`. So the nearest `speak` up the chain from `Puppy` is Dog's, and the program prints **Woof**.
