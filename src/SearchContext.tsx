import React, { useMemo } from 'react'
import * as RR from 'react-router-dom'
import { RouteObject, ParsedSearch } from './core'
import { defaultParseSearch, defaultStringifySearch } from './parser'
import { NavigateOptions } from './useNavigate'
import { Any } from './util'

export const SearchParamsProvider = ({
  children,
  routes,
  stringifySearch = defaultStringifySearch,
  parseSearch = defaultParseSearch,
}: SearchParamsProviderProps) => {
  const [urlSearch, setUrlSearch] = RR.useSearchParams()
  const location = RR.useLocation()

  // routes being rendered. data router context also provides matches.
  const matches = useMemo(
    () => RR.matchRoutes(routes as RR.RouteObject[], location) || [],
    [routes, location],
  )

  const parsed = React.useMemo(() => {
    const rawSearch = parseSearch(urlSearch.toString())

    const routeParsers = matches.flatMap((match) => {
      const parser = (match.route as RouteObject).parseSearch
      return parser ? [parser] : []
    })

    const _parsed = routeParsers.reduce<ParsedSearch>((acc, cur) => {
      return { ...acc, ...cur(rawSearch) }
    }, {})

    return _parsed
  }, [matches, urlSearch, parseSearch])

  const searchCtx: SearchParamsContext = useMemo(() => {
    return {
      search: parsed,
      setSearch: (s, o) => setUrlSearch(stringifySearch(s), o),
      matches,
    }
  }, [parsed, matches, setUrlSearch, stringifySearch])

  const parserCtx: ParserContext = useMemo(() => {
    return {
      parseSearch,
      stringifySearch,
      createPath: (opts) => {
        const { to, params, search, hash } = opts

        return {
          pathname: RR.generatePath(to as string, params as Any),
          search: search ? stringifySearch(search) : undefined,
          hash,
        }
      },
    }
  }, [parseSearch, stringifySearch])

  return (
    <SearchContext.Provider value={searchCtx}>
      <ParserContext.Provider value={parserCtx}>
        {children}
      </ParserContext.Provider>
    </SearchContext.Provider>
  )
}

export type SearchParamsProviderProps = {
  children: React.ReactNode
  /**
   *
   * User defined routes
   */
  routes: RouteObject[]
  /**
   *
   * Override the default search stringifier
   */
  stringifySearch?: (s: ParsedSearch) => string
  /**
   *
   * Override the default search parser
   */
  parseSearch?: (s: string) => ParsedSearch
}

/**
 *
 * Wraps user defined routes with {@link SearchParamsProvider}
 * @example
 * // with data router
 * const router = createBrowserRouter(
 *     withSearchParamsProvider({ routes }),
 * )
 *
 * // with useRoutes
 * const RoutesElement = useRoutes(
 *     withSearchParamsProvider({ routes }),
 * )
 */
export const withSearchParamsProvider = (
  props: Omit<SearchParamsProviderProps, 'children'>,
): RR.RouteObject[] => {
  return [
    {
      path: '/',
      element: (
        <SearchParamsProvider {...props}>
          <RR.Outlet />
        </SearchParamsProvider>
      ),
      children: props.routes as RR.RouteObject[],
    },
  ]
}

/**
 * Stable context for parser/stringifier. Consumers shouldn't re-render because of this context.
 */
type ParserContext = Pick<
  SearchParamsProviderProps,
  'parseSearch' | 'stringifySearch'
> & {
  createPath: (opts: NavigateOptions<Any, Any>) => Partial<RR.Path>
}

const ParserContext = React.createContext<ParserContext | undefined>(undefined)

export type SearchParamsContext = {
  search: ParsedSearch
  setSearch: (s: ParsedSearch, navigateOptions?: RR.NavigateOptions) => void
  matches: RR.RouteMatch[]
}

const SearchContext = React.createContext<SearchParamsContext | undefined>(
  undefined,
)

export const useSearchContext = () => {
  const c = React.useContext(SearchContext)
  if (!c) throw new Error(`Missing ${SearchParamsProvider.name}`)
  return c
}

export const useParserContext = () => {
  const c = React.useContext(ParserContext)
  if (!c) throw new Error(`Missing ${SearchParamsProvider.name}`)
  return c
}
