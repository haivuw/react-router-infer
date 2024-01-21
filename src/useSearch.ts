import { RegisteredRoutes } from '.'
import { BaseRoutes } from './core'
import { Any, ToObject } from './util'
import { useSearchContext } from './SearchContext'
import * as RR from 'react-router-dom'
import { useMemo } from 'react'

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
