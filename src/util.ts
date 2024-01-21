import RR from 'react-router-dom'

export type EmptyOutput = Expand<Record<never, never>> // {}

/** If params is never, return {@link EmptyOutput} */
export type ToObject<T extends Record<string, unknown> | never> =
  [T] extends [never] ? EmptyOutput : T

type ParamsFromKeys<Keys extends PropertyKey> = Readonly<
  Partial<Record<Keys, string | undefined>>
>

export type LoaderArg<ParamKeys extends PropertyKey> = Omit<
  RR.LoaderFunctionArgs,
  'params'
> & {
  params: ParamsFromKeys<ParamKeys>
}

export type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Rest}` ? [Head, ...Split<Rest, D>] : [S]

// https://github.com/Microsoft/TypeScript/issues/13298#issuecomment-885980381
export type UnionToIntersection<U> =
  (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ?
    I
  : never

type UnionToTuple<T> =
  UnionToIntersection<T extends never ? never : (t: T) => T> extends (
    (_: never) => infer W
  ) ?
    [...UnionToTuple<Exclude<T, W>>, W]
  : []

type ArrayToString<T, D extends string> =
  T extends [infer First, ...infer Rest] ?
    `${First & string}${Rest extends [] ? '' : D}${ArrayToString<Rest, D>}`
  : ''

// 'a' | 'b' -> 'a, b'
export type UnionToString<T> = ArrayToString<UnionToTuple<T>, ', '>

// https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type ExpandRecursively<T> =
  T extends object ?
    T extends infer O ?
      { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T

export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true
  : false

export type MergeObject<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
> =
  [A] extends [never] ? B
  : [B] extends [never] ? A
  : A & B

export type Merge<T extends unknown[], Acc = EmptyOutput> =
  T extends [infer Head, ...infer Tail] ?
    Merge<Tail, Omit<Acc, keyof Head> & Head>
  : Acc

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any
