import * as RR from 'react-router-dom'
import { ExpandRecursively, MergeObject, UnionToIntersection } from './util'

/**
 * Maps array of {@link RouteObject} to {@link BaseRoutes }
 *
 * @example
 *   const routes = [...] as const satisfies RouteObject[]
 *
 *   declare module 'packageName' {
 *   register: CreateRoutes<typeof routes>
 *   }
 */
export type CreateRoutes<T extends RouteObject[]> = IndexByPath<MapChildren<T>>

export type Route<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends RouteObject = RouteObject,
  FullPath extends string = string,
  Params extends ParsedParams = ParsedParams,
  Search extends ParsedSearch = ParsedSearch,
> = {
  /** Full path of the route */
  path: FullPath
  /** Aggregated path params of the route and its parents */
  params: Params
  /** Aggregated search params of the route and its parents */
  search: Search
  // pathTemplate: ToPathTemplate<FullPath>
}

export type BaseRoutes = Record<string, Route>

/** Extends `react-router-dom`'s `RouteObject` with `parseSearch` fields */
export type RouteObject = Omit<RR.RouteObject, 'children'> & {
  children?: RouteObject[]
  /**
   * @param raw Untyped search params parsed from URL
   * @returns Typed search params that is used by `useSearch`, `useParams`,
   *   `useNavigate`, `Link`, etc.
   */
  parseSearch?: (raw: RawSearch) => ParsedSearch
}

type MapChildren<
  T extends RouteObject['children'],
  ParentPath extends string = '',
  ParentParams extends ParsedParams = EmptyParams,
  ParentSearch extends ParsedSearch = EmptyParams,
> =
  T extends (
    [infer First extends RouteObject, ...infer Rest extends RouteObject[]]
  ) ?
    [
      ...Flatten<First, ParentPath, ParentParams, ParentSearch>,
      ...MapChildren<Rest, ParentPath, ParentParams, ParentSearch>,
    ]
  : []

type Flatten<
  T extends RouteObject,
  ParentPath extends string = '',
  ParentParams extends ParsedParams = EmptyParams,
  ParentSearch extends ParsedSearch = EmptyParams,
  // derived(s)
  FullPath extends string = JoinPaths<ParentPath, GetRoutePath<T>>,
  Params extends ParsedParams = MergeObject<
    ParentParams,
    PathToParam<GetRoutePath<T>>
  >,
  Search extends ParsedSearch = MergeObject<
    ParentSearch,
    GetRouteSearchParams<T>
  >,
> = [
  Route<T, FullPath, Params, Search>,
  ...MapChildren<T['children'], FullPath, Params, Search>,
]

/** Creates a map of {@link Route} indexed by their absolute `path`. */
type IndexByPath<T extends Route[]> = {
  [K in Extract<keyof T, `${number}`> as T[K] extends Route ? T[K]['path']
  : never]: ExpandRecursively<UnionToIntersection<T[K]>>
}

type GetRouteSearchParams<T extends RouteObject> =
  T['parseSearch'] extends (raw: RawSearch) => infer Search ?
    Search extends ParsedSearch ?
      Search
    : EmptyParams
  : EmptyParams

// /:foo/:bar -> /${string}/${string}
// type ToPathTemplate<S extends string> =
//   S extends `${infer Head}:${string}/${infer Rest}` ?
//     `${Head}${string}/${ToPathTemplate<Rest>}`
//   : S extends `${infer Head}:${string}` ? `${Head}${string}`
//   : S

export type PathToParam<S extends string> =
  S extends `:${infer Param}` ?
    Param extends `${infer OptionalParam}?${string}` ?
      { [key in OptionalParam]?: string }
    : { [key in Param]: string }
  : S extends `${string}/*` ? { '*': string }
  : EmptyParams

type DedupSlash<S extends string> =
  S extends `//${infer Rest}` ? DedupSlash<`/${Rest}`> : S

export type GetRoutePath<T extends RouteObject> =
  T['path'] extends string ? T['path'] : ''

export type JoinPaths<
  ParentPath extends string,
  CurrentPath extends string,
> = DedupSlash<`${ParentPath}${CurrentPath extends '' ? ''
: '/'}${CurrentPath}`>

export type GetAllParams<
  Routes extends BaseRoutes,
  Type extends keyof Route,
> = UnionToIntersection<Routes[keyof Routes][Type]>

export type EmptyParams = never
export type ParsedParams = Record<string, string>
type RawSearch = Record<string, unknown>
export type ParsedSearch = Record<string, unknown>

/**
 * Create a readonly route object. Same as `{...} as const satisfies
 * RouteObject`.
 *
 * @example
 *   const singleRoute = r({ path: '/' })
 *   const allRoutes = r([singleRoute])
 *
 *   declare module 'x' {
 *     register: CreateRoutes<typeof allRoutes>
 *   }
 */
export const r = <const T extends RouteObject | RouteObject[]>(
  routeOrRoutes: T,
) => routeOrRoutes

export type ScopeOptions<Path extends string> = {
  /** Narrow down path/search params to a specific path */
  from?: Path
}
