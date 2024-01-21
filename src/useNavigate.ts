import { RegisteredRoutes } from '.'
import * as RR from 'react-router-dom'
import type { IsUnion, Merge } from './util'
import type { BaseRoutes, EmptyParams, ParsedParams } from './core'
import { useParserContext } from './SearchContext'

/**
 * @example
 *   const navigate = useNavigate()
 *   navigate({
 *     to: '/:id',
 *     params: { id: 1 },
 *     // search is always optional
 *     search: { page: 1 },
 *     // RR.NavigateOptions
 *     replace: true,
 *     ...rest,
 *   })
 */
export function useNavigate<
  Routes extends BaseRoutes = RegisteredRoutes,
>(): NavigateFunction<Routes> {
  const navigate = RR.useNavigate()
  const { createPath } = useParserContext()

  return (opts) => {
    const { to, params, search, hash, ...rest } = opts
    navigate(
      createPath({
        to,
        params: params as ParsedParams,
        search,
        hash,
      }),
      rest,
    )
  }
}

export type NavigateOptions<
  Routes extends BaseRoutes,
  To extends keyof Routes,
> = {
  to: To
  search?: Routes[To]['search']
  hash?: string
} & (Routes[To]['params'] extends infer P ?
  [P] extends [EmptyParams] ? { params?: undefined }
  : IsUnion<To> extends true ? { params?: undefined }
  : { params: P }
: never)

export type NavigateFunction<Routes extends BaseRoutes> = <
  To extends keyof Routes,
>(
  opts: Merge<
    [
      //
      RR.NavigateOptions,
      NavigateOptions<Routes, To>,
    ]
  >,
) => void
