import { map, string, toErr, TypeAggregateErr } from "typed";
import { Err, Ok, type Result } from "rsts";

export type Rule = (str: string) => Result<string, TypeAggregateErr>;

const range = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

const UPPER_RANGE = range(65, 90);
const LOWER_RANGE = range(97, 122);
const DIGIT_RANGE = range(48, 57);
const LETTR_RANGE = [...UPPER_RANGE, ...LOWER_RANGE];
const SPACE_RANGE = [32, 9, 10, 13];
const SPECL_RANGE = [
  ...range(32, 47),
  ...range(58, 64),
  ...range(91, 96),
  ...range(123, 126),
];

const occ = (str: string, range: number[]): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (range.includes(str.charCodeAt(i))) {
      count++;
    }
  }
  return count;
};

const testCount = (
  str: string,
  range: number[],
  min: number,
  word: string,
): Result<string, TypeAggregateErr> => {
  const count = occ(str, range);
  return count >= min
    ? Ok(str)
    : Err(toErr(`Expecting at least '${min}' ${word}. Got '${count}'.`));
};

/**
 * Check if the string contains whitespaces
 */
export const nospace: Rule = (str: string) => {
  const count = occ(str, SPACE_RANGE);
  return count === 0
    ? Ok(str)
    : Err(toErr(`Expecting no whitespaces. Got '${count}'.`));
};

/**
 * Check if the string contains uppercase letters
 */
export const upper =
  (min = 1): Rule =>
  (str: string) =>
    testCount(str, UPPER_RANGE, min, "uppercase letters");

/**
 * Check if the string contains lowercase letters
 */
export const lower =
  (min = 1): Rule =>
  (str: string) =>
    testCount(str, LOWER_RANGE, min, "lowercase letters");

/**
 * Check if the string contains digits
 */
export const digit =
  (min = 1): Rule =>
  (str: string) =>
    testCount(str, DIGIT_RANGE, min, "digits");

/**
 * Check if the string contains letters
 */
export const letter =
  (count = 1): Rule =>
  (str: string) =>
    testCount(str, LETTR_RANGE, count, "letters");

/**
 * Check if the string contains special characters
 */
export const symbol =
  (count = 1): Rule =>
  (str: string) =>
    testCount(str, SPECL_RANGE, count, "symbols");

/**
 * Check if the string contains at least n characters
 */
export const min =
  (min: number): Rule =>
  (str: string) =>
    str.length >= min
      ? Ok(str)
      : Err(
          toErr(`Expecting at least '${min}' characters. Got '${str.length}'.`),
        );

/**
 * Check if the string contains at most n characters
 */
export const max =
  (max: number): Rule =>
  (str: string) =>
    str.length <= max
      ? Ok(str)
      : Err(
          toErr(`Expecting at most '${max}' characters. Got '${str.length}'.`),
        );

/**
 * Check if the string is blacklisted
 */
export const blacklist =
  (blacklist: string[]): Rule =>
  (str: string) =>
    blacklist.includes(str)
      ? Err(toErr(`Expecting not to be '${str}' password.`))
      : Ok(str);

/**
 * Check if the string passes all the rules
 */
export const password = (...rules: Rule[]) => {
  if (rules.length === 0) {
    rules = [nospace, min(8), max(24), upper(), lower(), digit()];
  }
  return map(string, (value) => {
    const err = new TypeAggregateErr();
    rules.forEach((rule) =>
      rule(value).match({
        Ok: () => void 0,
        Err: (e) => err.errors.push(...e.errors),
      }),
    );
    return err.errors.length ? Err(err) : Ok(value);
  });
};
