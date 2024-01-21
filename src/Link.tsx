import * as RR from 'react-router-dom'
import { NavigateOptions } from './useNavigate'
import { RegisteredRoutes } from '.'
import { Merge } from './util'
import { BaseRoutes, ParsedParams } from './core'
import React from 'react'
import { useParserContext } from './SearchContext'

/**
 * @example
 *   const render = (
 *     <Link
 *       to='/:id'
 *       params={{ id: 1 }}
 *       search={{ page: 1 }}
 *       // RR.NavigateOptions
 *       replace
 *       {...rest}
 *     />
 *   )
 *
 * @param props T {@removeType }
 */
export const Link: TLink = (props) => {
  const { to, params, search, hash, anchorRef, ...rest } = props
  const { createPath } = useParserContext()

  return (
    <RR.Link
      {...rest}
      ref={anchorRef}
      to={createPath({
        to,
        params: params as ParsedParams,
        search,
        hash,
      })}
    />
  )
}

export type LinkProps<
  Routes extends BaseRoutes,
  To extends keyof Routes,
> = Merge<
  [
    RR.LinkProps,
    NavigateOptions<Routes, To>,
    {
      anchorRef?: React.Ref<HTMLAnchorElement>
    },
  ]
>

export type TLink<Routes extends BaseRoutes = RegisteredRoutes> = <
  To extends keyof Routes,
>(
  props: LinkProps<Routes, To>,
) => JSX.Element
