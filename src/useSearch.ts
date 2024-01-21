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
 *   })
 *
 *   // search/setSearch can be undefined if `/dashboard` is not rendered. You need to handle that possibility.
 *   if (isInvalidRoute)
 *     throw new Error('useParams is called outside of "/has-search-params"')
 *
 *   // search/setSearch is safe to use after the check.
 *   setSearch(
 *     // new search state
 *     { page: search.page + 1 },
 *     // RR's NavigateOptions
 *     {
 *       replace: true,
 *     },
 *   )
 */
export const useSearch: UseSearch = ({ from }) => {
  const { search, setSearch, matches } = useSearchContext()

  const isFromRouteRendered = useMemo(
    () => matches.some((m) => RR.matchPath(from, m.pathname)),
    [from, matches],
  )

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

type UseSearch = <
  Routes extends BaseRoutes = RegisteredRoutes,
  From extends string & keyof Routes = string & keyof Routes,
>(opts: {
  from: From
}) => ToObject<Routes[From]['search']> extends infer Search ?
  | {
      isInvalidRoute: false
      search: Search
      setSearch: (search: Search, opts?: RR.NavigateOptions) => void
    }
  | {
      isInvalidRoute: true
      search: undefined
      setSearch: undefined
    }
: never
