import { TypeAggregateErr, TypeErr, toErr } from "typed";

import * as P from "./typed-password";

it("should test for whitespaces", () => {
  expect(P.nospace("").isOk()).toEqual(true);
  expect(P.nospace(" ").unwrapErr()).toEqual(
    toErr("Expecting no whitespaces. Got '1'."),
  );
});

it("should test for uppercase characters", () => {
  expect(P.upper(1)("Abc").isOk()).toEqual(true);
  expect(P.upper(2)("Abc").unwrapErr()).toEqual(
    toErr("Expecting at least '2' uppercase letters. Got '1'."),
  );
});

it("should test for lowercase characters", () => {
  expect(P.lower(1)("Abc").isOk()).toEqual(true);
  expect(P.lower(2)("ABc").unwrapErr()).toEqual(
    toErr("Expecting at least '2' lowercase letters. Got '1'."),
  );
});

it("should test for digits", () => {
  expect(P.digit(1)("Abc1").isOk()).toEqual(true);
  expect(P.digit(2)("Abc1").unwrapErr()).toEqual(
    toErr("Expecting at least '2' digits. Got '1'."),
  );
});

it("should test for letters", () => {
  expect(P.letter(1)("Ab").isOk()).toEqual(true);
  expect(P.letter(2)("a1").unwrapErr()).toEqual(
    toErr("Expecting at least '2' letters. Got '1'."),
  );
});

it("should test for symbols", () => {
  expect(P.symbol(1)("Ab$").isOk()).toEqual(true);
  expect(P.symbol(2)("Ab$").unwrapErr()).toEqual(
    toErr("Expecting at least '2' symbols. Got '1'."),
  );
});

it("should test for min lenght", () => {
  expect(P.min(2)("Ab").isOk()).toEqual(true);
  expect(P.min(2)("A").unwrapErr()).toEqual(
    toErr("Expecting at least '2' characters. Got '1'."),
  );
});

it("should test for max length", () => {
  expect(P.max(2)("Ab").isOk()).toEqual(true);
  expect(P.max(2)("Abc").unwrapErr()).toEqual(
    toErr("Expecting at most '2' characters. Got '3'."),
  );
});

it("should test for blacklisted passwords", () => {
  expect(P.blacklist(["Abc"])("Abd").isOk()).toEqual(true);
  expect(P.blacklist(["Abc"])("Abc").unwrapErr()).toEqual(
    toErr("Expecting not to be 'Abc' password."),
  );
});

describe(".password()", () => {
  it("should have default rules", () => {
    const p = P.password();

    expect(p("Abcdefg1").isOk()).toEqual(true);
    expect(p(" ").unwrapErr()).toEqual(
      new TypeAggregateErr([
        new TypeErr("Expecting no whitespaces. Got '1'."),
        new TypeErr("Expecting at least '8' characters. Got '1'."),
        new TypeErr("Expecting at least '1' uppercase letters. Got '0'."),
        new TypeErr("Expecting at least '1' lowercase letters. Got '0'."),
        new TypeErr("Expecting at least '1' digits. Got '0'."),
      ]),
    );
  });
});
