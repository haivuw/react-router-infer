import { BaseRoutes } from './core'

export interface Register {
  // routes: CreateRoutes<typeof routes>
}

export type RegisteredRoutes =
  Register extends { routes: infer Routes } ? Routes : BaseRoutes

export type { CreateRoutes, RouteObject, BaseRoutes } from './core'
export { r } from './core'

export { useParams } from './useParams'
export { useSearch } from './useSearch'
export {
  useNavigate,
  type NavigateOptions,
  type NavigateFunction,
} from './useNavigate'
export { Link, type LinkProps, type TLink } from './Link'

export {
  SearchParamsProvider,
  withSearchParamsProvider,
  type SearchParamsProviderProps,
} from './SearchContext'

/** @see https://tanstack.com/router/v1/docs/guide/custom-search-param-serialization */
export {
  parseSearchWith,
  stringifySearchWith,
  defaultParseSearch,
  defaultStringifySearch,
} from './parser'
