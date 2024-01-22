import {
  BaseRoutes,
  NavigateTo,
  RegisteredRoutes,
  defaultStringifySearch,
} from '.'
import * as RR from 'react-router-dom'
import { ParserUtils } from './SearchContext'
import { Any } from './util'

export type GeneratePath<Routes extends BaseRoutes> = <
  To extends keyof Routes = keyof Routes,
>(
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
export const create_generatePath = <
  Routes extends BaseRoutes = RegisteredRoutes,
>(
  opts?: Pick<ParserUtils, 'stringifySearch'>,
) => {
  const stringifySearch = opts?.stringifySearch ?? defaultStringifySearch

  const generatePath: GeneratePath<Routes> = (to) => {
    const pathname = RR.generatePath(to.to as string, to.params as Any)
    const search = to.search ? stringifySearch(to.search) : ''
    const hash = to.hash ?? ''

    return `${pathname}${search}${hash}`
  }

  return generatePath
}

/**
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
export const generatePath = create_generatePath()
