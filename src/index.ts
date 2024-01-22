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
  type NavigateTo,
  type NavigateFunction,
} from './useNavigate'
export { Link } from './Link'
export { NavLink } from './NavLink'
export { generatePath, create_generatePath } from './generatePath'

export {
  SearchParamsProvider,
  withSearchParamsProvider,
  type SearchParamsProviderProps,
  type ParserUtils,
} from './SearchContext'

/** @see https://tanstack.com/router/v1/docs/guide/custom-search-param-serialization */
export {
  parseSearchWith,
  stringifySearchWith,
  defaultParseSearch,
  defaultStringifySearch,
} from './parser'
