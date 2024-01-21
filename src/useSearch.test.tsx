import { type CreateRoutes, type RouteObject } from './core'
import { describe, expect, mock, test } from 'bun:test'
import { renderHook } from '@testing-library/react'
import { z } from 'zod'
import { createWrapper } from '../test/react-wrapper'
import { useSearch } from './useSearch'
import { defaultStringifySearch } from '.'

const schema0 = z.object({
  string: z.string(),
  number: z.number(),
  object: z.object({
    union: z.union([z.literal('x'), z.literal('y')]),
    array: z.array(z.string()),
    arrayOfObjects: z.array(z.object({ a: z.string() })),
  }),
})

const search0: z.infer<typeof schema0> = {
  string: 'hello',
  number: 123,
  object: {
    union: 'x',
    array: ['a', 'b'],
    arrayOfObjects: [{ a: 'a' }, { a: 'b' }],
  },
}

const schema1 = z.object({
  page: z.number().optional(),
})

const routes = [
  {
    path: 'dashboard',
    element: <></>,
    parseSearch: (search) => schema0.parse(search),
  },
  {
    path: 'store',
    element: <></>,
    parseSearch: (search) => schema1.parse(search),
  },
] as const satisfies RouteObject[]

type Routes = CreateRoutes<typeof routes>

describe('useSearch', () => {
  test('works', () => {
    const _useSearch = mock(useSearch<Routes>)
    const { result } = renderHook(() => _useSearch({ from: '/dashboard' }), {
      wrapper: createWrapper({
        routes,
        memoryRouterOpts: {
          initialEntries: [
            {
              pathname: '/dashboard',
              search: defaultStringifySearch(search0),
            },
          ],
        },
      }),
    })

    expect(_useSearch).toHaveBeenCalledTimes(1)
    expect(result.current?.search).toEqual(search0)
  })

  test('returns undefined if From route is not rendered', () => {
    const _useSearch = mock(useSearch<Routes>)
    const { result } = renderHook(() => _useSearch({ from: '/store' }), {
      wrapper: createWrapper({
        routes,
        memoryRouterOpts: {
          initialEntries: [
            {
              pathname: '/dashboard',
              search: defaultStringifySearch(search0),
            },
          ],
        },
      }),
    })

    expect(_useSearch).toHaveBeenCalledTimes(1)
    expect(result.current).toEqual({
      isInvalidRoute: true,
      search: undefined,
      setSearch: undefined,
    })
  })
})
