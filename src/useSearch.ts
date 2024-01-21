import { RegisteredRoutes } from '.'
import { BaseRoutes } from './core'
import { ToObject } from './util'
import { useSearchContext } from './SearchContext'
import * as RR from 'react-router-dom'
import { useMemo } from 'react'

export function useSearch<
  Routes extends BaseRoutes = RegisteredRoutes,
  From extends string & keyof Routes = string & keyof Routes,
  Search = ToObject<Routes[From]['search']>,
  Output =
    | {
        invalidRoute: false
        search: Search
        setSearch: (search: Search, opts?: RR.NavigateOptions) => void
      }
    | {
        invalidRoute: true
        search: undefined
        setSearch: undefined
      },
>(opts: { from: From }): Output {
  const { from } = opts
  const { search, setSearch, matches } = useSearchContext()

  const isFromRouteRendered = useMemo(
    () => matches.some((m) => RR.matchPath(from, m.pathname)),
    [from, matches],
  )

  if (!isFromRouteRendered) {
    return {
      invalidRoute: true,
      search: undefined,
      setSearch: undefined,
    } as Output
  }
  return { invalidROute: false, search, setSearch } as Output
}
