---
sidebar_position: 2
---

# Naming Conventions

- [x] **Name should reveal intent**

  - It should tell you why it exists, what it does, and how it is used.
  - Name should depict the context.

- [x] **Avoid using abbreviations**

  - Use `hypotenuse` instead of `hp`.

- [x] **Do not encode name with data structure**

  - Use `accounts` instead of `accountList`.

- [x] **Do not use names which vary in small ways**

  - Find the difference between `ControllerForEfficientHandlingOfStrings` and
    `ControllerForEfficientStorageOfStrings` :dancers:

- [x] **Do not name variables just to satisfy the compiler**

  - Don't name something `name1` cause `name` is already taken.

- [x] **Avoid using noise words**

  - `ProductData` and `ProductInfo` kind of means the same thing.
  - Similarly words like `a`, `an`, `the` are also noise words, for example
    naming a variable `product` is sufficient, no need to `theProduct`
  - Noise words are also **redundant**, use `name` instead of `nameString`.

- [x] **Distinguish names in such a way that the reader knows which one to call.**

- [x] **Use pronounceable names**

- [x] **Use searchable names**
  - Use constants instead of hard coding a value, `WORK_DAYS_PER_WEEK = 5`
    instead of just using 5.
- [x] **Include units of a measurable entity to its variable name**

  - Using `expiryTimeInSeconds` is better than `expiryTime`

- [x] **The length of a name should correspond to the size of its scope**

  - There can be a variable `i` inside a `for loop` but `i` should never be a
    `instance variable`.

- [x] **Classes and objects should have noun or noun phrase names.**

  - Avoid words like `Manager`, `Processor`, `Data`, or `Info` in the name of a class.
  - If your class name ends with `er`, `or` or `utils`, you should consider re
    looking at the responsibility of the class.
  - A class name should not be a verb.

- [x] **Methods should have verb or verb phrase names**

- [x] **When constructors are overloaded, try to use static factory methods with
      names that describe the** **arguments**

  - `Complex fulcrumPoint = Complex.FromRealNumber(23.0)` is better than
    `Complex fulcrumPoint = new Complex(23.0)`

- [x] **Pick one word for one abstract concept and stick with it**

  - For instance, it’s confusing to have `fetch`, `retrieve`, and `get` as
    equivalent methods of different classes.

- [x] **Don’t add gratuitous context**

  - For application "Gas Station Deluxe," it is a bad idea to prefix every class
    with `GSD`.
  - For example use `AccountAddress` instead of `GSDAccountAddress`

- [x] **It's okay to use computer science terms, algorithm names, pattern names,
      math terms**

  - Always using the problem domain to get names might result in complication,
    hence we can use solution domain names on need.

- [x] **Add no more context to a name than is necessary**
  - Shorter names are generally better than longer ones, so long as they are clear.
