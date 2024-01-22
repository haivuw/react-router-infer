import { useParserContext } from './SearchContext'
import * as RR from 'react-router-dom'
import { BaseRoutes, ParsedParams } from './core'
import { NavigateTo, RegisteredRoutes } from '.'
import { Any } from './util'

/**
 * @example
 *   const render = (
 *     <NavLink
 *       to='/:id'
 *       params={{ id: 1 }}
 *       search={{ page: 1 }}
 *       // react-router's NavigateOptions
 *       replace
 *       {...rest}
 *     />
 *   )
 *
 * @param props T {@removeType}
 */
export const NavLink: TNavLink = (props) => {
  const { to, params, search, hash, anchorRef, ...rest } = props
  const { createPath } = useParserContext()

  return (
    <RR.NavLink
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

export type NavLinkProps<
  Routes extends BaseRoutes,
  To extends keyof Routes,
> = Omit<RR.NavLinkProps, keyof NavigateTo<Any, Any>> &
  NavigateTo<Routes, To> & {
    anchorRef?: React.Ref<HTMLAnchorElement>
  }

export type TNavLink<Routes extends BaseRoutes = RegisteredRoutes> = <
  To extends keyof Routes,
>(
  props: NavLinkProps<Routes, To>,
) => JSX.Element
