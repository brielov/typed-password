import * as T from "typed";

import * as P from "./typed-password";

it("should test for whitespaces", () => {
  expect(P.nospace("")).toEqual(T.success(""));

  expect(P.nospace(" ")).toEqual(
    T.failure(T.toError("Expecting no whitespaces. Got '1'")),
  );
});

it("should test for uppercase characters", () => {
  expect(P.upper(1)("Abc")).toEqual(T.success("Abc"));
  expect(P.upper(2)("Abc")).toEqual(
    T.failure(T.toError("Expecting at least '2' uppercase letters. Got '1'")),
  );
});

it("should test for lowercase characters", () => {
  expect(P.lower(1)("Abc")).toEqual(T.success("Abc"));
  expect(P.lower(2)("ABc")).toEqual(
    T.failure(T.toError("Expecting at least '2' lowercase letters. Got '1'")),
  );
});

it("should test for digits", () => {
  expect(P.digit(1)("Abc1")).toEqual(T.success("Abc1"));
  expect(P.digit(2)("Abc1")).toEqual(
    T.failure(T.toError("Expecting at least '2' digits. Got '1'")),
  );
});

it("should test for letters", () => {
  expect(P.letter(1)("Ab")).toEqual(T.success("Ab"));
  expect(P.letter(2)("a1")).toEqual(
    T.failure(T.toError("Expecting at least '2' letters. Got '1'")),
  );
});

it("should test for symbols", () => {
  expect(P.symbol(1)("Ab$")).toEqual(T.success("Ab$"));
  expect(P.symbol(2)("Ab$")).toEqual(
    T.failure(T.toError("Expecting at least '2' symbols. Got '1'")),
  );
});

it("should test for min lenght", () => {
  expect(P.min(2)("Ab")).toEqual(T.success("Ab"));
  expect(P.min(2)("A")).toEqual(
    T.failure(T.toError("Expecting at least '2' characters. Got '1'")),
  );
});

it("should test for max length", () => {
  expect(P.max(2)("Ab")).toEqual(T.success("Ab"));
  expect(P.max(2)("Abc")).toEqual(
    T.failure(T.toError("Expecting at most '2' characters. Got '3'")),
  );
});

it("should test for blacklisted passwords", () => {
  expect(P.blacklist(["Abc"])("Abc")).toEqual(
    T.failure(T.toError("Expecting not to be 'Abc' password")),
  );
  expect(P.blacklist(["Abc"])("Abd")).toEqual(T.success("Abd"));
});

describe(".password()", () => {
  it("should have default rules", () => {
    const p = P.password();

    expect(p("Abcdefg1")).toEqual(T.success("Abcdefg1"));
    expect(p(" ")).toEqual(
      T.failure(
        T.toError("Expecting no whitespaces. Got '1'"),
        T.toError("Expecting at least '8' characters. Got '1'"),
        T.toError("Expecting at least '1' uppercase letters. Got '0'"),
        T.toError("Expecting at least '1' lowercase letters. Got '0'"),
        T.toError("Expecting at least '1' digits. Got '0'"),
      ),
    );
  });
});
