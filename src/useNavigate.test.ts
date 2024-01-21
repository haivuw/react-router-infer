import {
  dynamicRoutes,
  optionalParamsRoutes,
  searchParamsRoutes,
  splatRoutes,
} from '../test/mock'
import { type CreateRoutes } from '.'
import { describe, expect, test } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { createWrapper } from '../test/react-wrapper'
import { useNavigate } from './useNavigate'
import * as RR from 'react-router-dom'
import { Assert, PropertyIsOptional } from '../test/util'
import { Equal } from './util'
import { useParserContext } from './SearchContext'

describe('useNavigate', () => {
  test('dynamic path', async () => {
    const routes = dynamicRoutes
    const _useNavigate = useNavigate<CreateRoutes<typeof routes>>
    const { result } = renderHook(
      () => ({
        navigate: _useNavigate(),
        location: RR.useLocation(),
      }),
      {
        wrapper: createWrapper({
          routes,
        }),
      },
    )

    act(() => {
      result.current.navigate({
        to: '/:dynamic1/:dynamic2',
        params: {
          dynamic1: 'a',
          dynamic2: 'b',
        },
      })
    })

    expect(result.current.location.pathname).toEqual('/a/b')
  })

  test('navigate with search', async () => {
    const routes = searchParamsRoutes
    const _useNavigate = useNavigate<CreateRoutes<typeof routes>>
    const { result } = renderHook(
      () => ({
        navigate: _useNavigate(),
        location: RR.useLocation(),
      }),
      {
        wrapper: createWrapper({
          routes,
        }),
      },
    )

    act(() => {
      result.current.navigate({
        to: '/has-search',
        search: {
          bool: true,
          view: 'list',
        },
      })
    })

    expect(result.current.location.pathname).toEqual('/has-search')
    expect(result.current.location.search).toEqual('?bool=true&view=list')
  })

  // To is now required.
  // test('if To in not specified, params must be optional or undefined', () => {
  //   const routes = dynamicRoutes
  //   const _useNavigate = useNavigate<CreateRoutes<typeof routes>>
  //   type nav = ReturnType<typeof _useNavigate>
  //   type navOpts = Parameters<nav>[0]

  //   type tests = [
  //     Assert<Equal<navOpts['params'], undefined>>,
  //     Assert<PropertyIsOptional<navOpts, 'params'>>,
  //   ]
  // })

  test('optional params', async () => {
    const routes = optionalParamsRoutes
    type Routes = CreateRoutes<typeof routes>
    const _useNavigate = useNavigate<Routes>

    const { result } = renderHook(
      () => ({
        navigate: _useNavigate(),
        location: RR.useLocation(),
      }),
      {
        wrapper: createWrapper({
          routes,
        }),
      },
    )

    act(() => {
      result.current.navigate({
        to: '/:lang?/docs/:version?',
        params: {},
      })
    })
    expect(result.current.location.pathname).toEqual('/docs')

    act(() => {
      result.current.navigate({
        to: '/:lang?/docs/:version?',
        params: {
          lang: 'en',
        },
      })
    })
    expect(result.current.location.pathname).toEqual('/en/docs')

    act(() => {
      result.current.navigate({
        to: '/:lang?/docs/:version?',
        params: {
          lang: 'en',
          version: 'v1',
        },
      })
    })
    expect(result.current.location.pathname).toEqual('/en/docs/v1')

    act(() => {
      result.current.navigate({
        to: '/:lang?/docs/:version?',
        params: {
          version: 'v1',
        },
      })
    })
    expect(result.current.location.pathname).toEqual('/docs/v1')
  })

  test('splat params', async () => {
    const routes = splatRoutes
    type Routes = CreateRoutes<typeof routes>
    const _useNavigate = useNavigate<Routes>

    const { result } = renderHook(
      () => ({
        navigate: _useNavigate(),
        location: RR.useLocation(),
      }),
      {
        wrapper: createWrapper({
          routes,
        }),
      },
    )

    act(() => {
      result.current.navigate({
        to: '/splat/*',
        params: {
          '*': 'a/b/c',
        },
      })
    })

    expect(result.current.location.pathname).toEqual('/splat/a/b/c')
  })
})

describe('createPath', () => {
  test('with params and search', () => {
    const { result } = renderHook(() => useParserContext(), {
      wrapper: createWrapper({
        routes: dynamicRoutes,
      }),
    })

    const to = result.current.createPath({
      to: '/:dynamic1/:dynamic2',
      params: {
        dynamic1: 'a',
        dynamic2: 'b',
      },
      search: {
        searchA: 'A',
        searchB: 'B',
      },
      hash: '#hash',
    })

    expect(to).toEqual({
      pathname: '/a/b',
      search: '?searchA=A&searchB=B',
      hash: '#hash',
    })
  })
})
