# typed-password

A simple rule-based [typed](https://github.com/brielov/typed) add-on for checking for password strength.

## Installation

```shell
npm install typed-password
```

## Usage

```typescript
import * as T from "typed";
import * as P from "typed-password";

const blacklist = P.blacklist(["password", "12345678"]);

const password = P.password(
  P.nospace, // Don't allow spaces
  P.min(8), // Minimum length of 8
  P.max(20), // Maximum length of 20
  P.upper(1), // At least one upper case letter
  P.lower(1), // At least one lower case letter
  P.number(1), // At least one number
  P.special(1), // At least one special character
  blacklist, // Don't allow any of the blacklisted passwords
);

const userType = T.object({
  email: T.string,
  password, // password is a typed-password rule
});
```

## Defaults

`typed-password` uses the following defaults: `[nospace, min(8), max(24), upper(), lower(), digit()]`. So if you are okay with that, you can simply use `password()` instead of `password(...)`.
