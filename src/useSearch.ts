import { RegisteredRoutes } from '.'
import { BaseRoutes } from './core'
import { Any, ToObject } from './util'
import { useSearchContext } from './SearchContext'
import * as RR from 'react-router-dom'
import { useMemo } from 'react'

/**
 * @example
 *   const { search, setSearch, isInvalidRoute } = useSearch({
 *     // the absolute path this hook is called under.
 *     from: '/dashboard',
 *     // whether to throw an error if the route is not rendered.
 *     // default = true
 *     throwOnInvalidRoute: false,
 *   })
 *
 *   // if `throwOnInvalidRoute` is false, you have to handle the case.
 *   if (isInvalidRoute) throw YOUR_ERROR
 *
 *   // search/setSearch is safe to use after the check.
 *   setSearch(
 *     // new search state
 *     { page: search.page + 1 },
 *     // react-router's NavigateOptions
 *     {
 *       replace: true,
 *     },
 *   )
 */
export const useSearch: UseSearch = ({ from, throwOnInvalidRoute = true }) => {
  const { search, setSearch, matches } = useSearchContext()

  const isFromRouteRendered = useMemo(
    () => matches.some((m) => RR.matchPath(from, m.pathname)),
    [from, matches],
  )

  if (!isFromRouteRendered && throwOnInvalidRoute) {
    throw new Error(`${useSearch.name} is called outside of "${from}"`)
  }

  return (
    isFromRouteRendered ?
      {
        isInvalidRoute: false,
        search,
        setSearch,
      }
    : {
        isInvalidRoute: true,
        search: undefined,
        setSearch: undefined,
      }) as Any
}

type UseSearchInput<From extends string, Throw extends boolean> = {
  from: From
  throwOnInvalidRoute?: Throw
}

type UseSearchOutput<
  Routes extends BaseRoutes,
  From extends string & keyof Routes,
  Throw extends boolean,
  // deriveds
  Search = ToObject<Routes[From]['search']>,
  ValidOutput = {
    isInvalidRoute: false
    search: Search
    setSearch: (search: Search, opts?: RR.NavigateOptions) => void
  },
  InvalidOutput = {
    isInvalidRoute: true
    search: undefined
    setSearch: undefined
  },
> = Throw extends true ? ValidOutput : ValidOutput | InvalidOutput

type UseSearch = <
  Routes extends BaseRoutes = RegisteredRoutes,
  From extends string & keyof Routes = string & keyof Routes,
  Throw extends boolean = true,
>(
  opts: UseSearchInput<From, Throw>,
) => UseSearchOutput<Routes, From, Throw>
