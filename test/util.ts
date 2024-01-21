import { Equal } from '../src/util'

export const expectTypeOf = <Actual>(_: Actual) => ({
  toEqualTypeOf: <
    Expected extends Equal<Actual, Expected> extends true ? unknown
    : 'Type mismatch',
  >() => {},
})

export type Negate<T extends boolean> = T extends true ? false : true

export type IsKeyRequired<T, K extends keyof T> = PickRequired<T> extends (
  Pick<T, K>
) ?
  true
: false

// {a: 1, b?: 1} -> {a: 1}
export type PickRequired<T> = {
  [key in keyof T as Pick<T, key> extends Required<Pick<T, key>> ? key
  : never]: T[key]
}

export type Assert<T extends true> = T

export type PropertyIsOptional<T, K extends keyof T> = Equal<
  Partial<Pick<T, K>>,
  Pick<T, K>
>
