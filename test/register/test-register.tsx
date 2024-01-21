/**
 * Type checks when Routes is registered.
 *
 * VSCode: restart TS server after build.
 */
import React from 'react'
import {
  type CreateRoutes,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '../../dist'
import { Equal } from '../../src/util'
import { mixedRoutes } from '../mock'
import { Assert } from '../util'

type Routes = CreateRoutes<typeof mixedRoutes>

declare module '../../dist' {
  interface Register {
    routes: Routes
  }
}

const allParams = useParams()
type expected_allParams = {
  dynamic1?: string | undefined
  dynamic2?: string | undefined
  lang?: string | undefined
  version?: string | undefined
  '*'?: string | undefined
}

const scopedParams = useParams({
  from: '/:dynamic1/:dynamic2',
})
type expected_scopedParams = Pick<expected_allParams, 'dynamic1' | 'dynamic2'>

const emptyParams = useParams({
  from: '/static',
})

type useParams_tests = [
  Assert<Equal<typeof allParams, expected_allParams>>,
  Assert<Equal<typeof scopedParams, expected_scopedParams>>,
  Assert<Equal<typeof emptyParams, {}>>,
]

type expected_search_0 = {
  view?: 'grid' | 'list' | undefined
  bool?: boolean | undefined
  nested: {
    a?: string | undefined
    b?: string[] | undefined
  }
}

const scopedSearch = useSearch({
  from: '/has-search',
})
if (scopedSearch.invalidRoute) throw 0
type expected_search_1 = Pick<expected_search_0, 'view' | 'bool'>

const emptySearch = useSearch({
  from: '/static',
})
if (emptySearch.invalidRoute) throw 0

type useSearch_tests = [
  Assert<Equal<typeof scopedSearch.search, expected_search_1>>,
  Assert<
    Equal<Parameters<typeof scopedSearch.setSearch>[0], expected_search_1>
  >,
  Assert<Equal<typeof emptySearch.search, {}>>,
  Assert<Equal<Parameters<typeof emptySearch.setSearch>[0], {}>>,
]

const navigate = useNavigate()
navigate({
  to: '/has-search',
  search: {
    bool: true,
  },
})

type useNavigate_tests = [
  Assert<Equal<Parameters<typeof navigate<'/static'>>[0]['params'], undefined>>,
  Assert<
    Equal<
      Parameters<typeof navigate<'/:dynamic1'>>[0]['params'],
      {
        dynamic1: string
      }
    >
  >,
  Assert<
    Equal<
      Parameters<typeof navigate<'/:dynamic1/:dynamic2'>>[0]['params'],
      {
        dynamic1: string
        dynamic2: string
      }
    >
  >,
]

const Link_tests = [
  <Link
    anchorRef={React.createRef<HTMLAnchorElement>()}
    to='/:dynamic1/:dynamic2'
    params={{
      dynamic1: '1',
      dynamic2: '2',
    }}
  />,
  <Link to='/static' />,
  <Link
    to='/search1'
    search={{
      nested: {
        a: '1',
        b: ['1'],
      },
    }}
  />,
]
