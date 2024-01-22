import {
  BaseRoutes,
  NavigateTo,
  RegisteredRoutes,
  defaultStringifySearch,
} from '.'
import * as RR from 'react-router-dom'
import { ParserUtils } from './SearchContext'
import { Any } from './util'

export type GeneratePath<Routes extends BaseRoutes> = <To extends keyof Routes>(
  to: NavigateTo<Routes, To>,
) => string

/**
 * Return a new `generatePath` function that uses the custom `stringifySearch`
 *
 * @example
 *   const generatePath = create_generatePath({
 *     stringifySearch: () => '?custom',
 *   })
 */
export const create_generatePath: CreateGeneratePath = (opts) => {
  const stringifySearch = opts?.stringifySearch ?? defaultStringifySearch

  return (to) => {
    const pathname = RR.generatePath(to.to as string, to.params as Any)
    const search = to.search ? stringifySearch(to.search) : ''
    const hash = to.hash ?? ''
    return `${pathname}${search}${hash}`
  }
}

type CreateGeneratePath = <Routes extends BaseRoutes = RegisteredRoutes>(
  opts?: Pick<ParserUtils, 'stringifySearch'>,
) => GeneratePath<Routes>

/**
 * Default `generatePath` that uses `defaultStringifySearch`
 *
 * @example
 *   import { redirect } from 'react-router-dom'
 *   import { generatePath } from 'react-router-infer'
 *
 *   const path = generatePath({
 *     to: '/:id',
 *     params: { id: '1' },
 *     search: { page: 1 },
 *   })
 *   redirect(path)
 */
export const generatePath = create_generatePath() as DefaultGeneratePath

/**
 * Fn create_generatePath is called before the {@link RegisteredRoutes} are
 * registered to provide a default generatePath fn, so the default generatePath
 * is typed as if the routes are empty. To be able to infer from
 * RegisteredRoutes, generatePath needs to be casted to a separate type that has
 * RegisteredRoutes as type parameter.
 */
type DefaultGeneratePath = <
  Routes extends BaseRoutes = RegisteredRoutes,
  To extends keyof Routes = keyof Routes,
>(
  to: NavigateTo<Routes, To>,
) => string
