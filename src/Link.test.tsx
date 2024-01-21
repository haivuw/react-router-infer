import { r, CreateRoutes } from './core'
import { afterEach, describe, expect, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { createWrapper } from '../test/react-wrapper'
import * as RR from 'react-router-dom'
import { Equal } from './util'
import { Link, TLink } from './Link'
import { IsKeyRequired, Assert, PickRequired } from '../test/util'
import { ComponentProps } from 'react'
import { defaultStringifySearch } from './parser'

let location: RR.Location | undefined

const Expected = () => {
  location = RR.useLocation()
  return <div>Expected</div>
}

const mockRoutes = r([
  {
    path: 'book',
    children: [
      {
        path: ':bookId',
        children: [
          {
            path: ':anotherId',
            parseSearch: () => {
              return { a: 1, b: true }
            },
            element: <Expected />,
          },
        ],
      },
    ],
  },
  {
    path: 'dashboard',
    parseSearch: () => ({ other: true }),
  },
])

type Routes = CreateRoutes<typeof mockRoutes>

const BaseLink = Link as TLink<Routes>
const Link0: typeof BaseLink<'/book/:bookId/:anotherId'> = BaseLink
type Prop0 = ComponentProps<typeof Link0>

describe('Link', () => {
  afterEach(() => {
    location = undefined
  })
  test('works', async () => {
    render(
      <Link0
        to='/book/:bookId/:anotherId'
        params={{ bookId: '123', anotherId: '456' }}
        search={{
          a: 1,
          b: true,
        }}
      >
        Link
      </Link0>,
      {
        wrapper: createWrapper({
          routes: mockRoutes,
        }),
      },
    )

    fireEvent.click(screen.getByText('Link'))
    const el = await screen.findByText('Expected')

    expect(el.innerText).toEqual('Expected')
    expect(location?.pathname).toEqual('/book/123/456')
    expect(location?.search).toEqual(defaultStringifySearch({ a: 1, b: true }))
  })

  test('required params', () => {
    type tests = [
      Assert<IsKeyRequired<Prop0, 'params'>>,
      Assert<Equal<Prop0['params'], { bookId: string; anotherId: string }>>,
    ]
  })

  test('no params', () => {
    type Link1 = typeof BaseLink<'/dashboard'>
    type Props1 = ComponentProps<Link1>
    type tests = [
      // params type is undefined and optional
      Assert<Equal<Props1['params'], undefined>>,
      Assert<Equal<Partial<Pick<Props1, 'params'>>, Pick<Props1, 'params'>>>,
    ]
  })

  test('search', () => {
    type tests = [
      Assert<Equal<Prop0['search'], undefined | { a: number; b: boolean }>>,
    ]
  })
})
