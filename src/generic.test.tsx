import { describe, test } from 'bun:test'
import {
  CreateRoutes,
  Link,
  NavLink,
  create_generatePath,
  useNavigate,
  useParams,
} from '.'
import { mixedRoutes } from '../test/mock'
import { TLink } from './Link'
import { TNavLink } from './NavLink'
import { UseNavigate } from './useNavigate'
import { UseParams } from './useParams'
import { UseSearch, useSearch } from './useSearch'
import { expectTypeOf } from '../test/util'

type Routes = CreateRoutes<typeof mixedRoutes>

const scoped = {
  useNavigate: useNavigate as UseNavigate<Routes>,
  useParams: useParams as UseParams<Routes>,
  useSearch: useSearch as unknown as UseSearch<Routes>,
  Link: Link as TLink<Routes>,
  NavLink: NavLink as TNavLink<Routes>,
  generatePath: create_generatePath<Routes>(),
}

describe('Scoped routes (not using global Register interface)', () => {
  test('correct types', () => {
    const dontCallThisFn = () => {
      const params = scoped.useParams()

      const navigate = scoped.useNavigate()
      navigate({
        to: '/splat/*',
        params: {
          '*': 'a/b/c',
        },
      })

      const { search, setSearch, isInvalidRoute } = scoped.useSearch({
        from: '/has-search',
      })
      expectTypeOf(search).toEqualTypeOf<{
        view?: 'grid' | 'list' | undefined
        bool?: boolean | undefined
      }>()

      const path = scoped.generatePath({
        to: '/:lang?/docs/:version?',
        params: {
          lang: 'en',
          version: 'latest',
        },
      })

      expectTypeOf(path).toEqualTypeOf<string>()
      expectTypeOf(params).toEqualTypeOf<{
        dynamic1?: string | undefined
        dynamic2?: string | undefined
        lang?: string | undefined
        version?: string | undefined
        '*'?: string | undefined
      }>()

      return (
        <>
          <scoped.Link
            to='/:dynamic1/:dynamic2'
            params={{
              dynamic1: '123',
              dynamic2: '456',
            }}
          />
          <scoped.NavLink
            to='/static'
            className={({ isActive }) => 'text-red-500'}
          />
        </>
      )
    }
  })
})
