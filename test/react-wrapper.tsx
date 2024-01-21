import React from 'react'
import { withSearchParamsProvider, type RouteObject } from '../src'
import { createMemoryRouter } from 'react-router-dom'
import * as RR from 'react-router-dom'
import { RenderOptions } from '@testing-library/react'

// render children in a memory router. only possible with data router because it allows reading params from parent routes
export const createWrapper =
  (createWrapperOpts: {
    routes: RouteObject[]
    memoryRouterOpts?: MemoryRouterOpts
  }): RenderOptions['wrapper'] =>
  (wrapperProps: {
    /** Children is where the tested hook/element is rendered */
    children: React.ReactNode
  }) => {
    const { routes, memoryRouterOpts } = createWrapperOpts

    const router = createMemoryRouter(
      withSearchParamsProvider({
        routes: [
          {
            path: '/',
            element: <Component>{wrapperProps.children}</Component>,
            children: routes,
          },
        ],
      }),
      memoryRouterOpts,
    )
    return <RR.RouterProvider router={router} />
  }

const Component = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RR.Outlet />
      {children}
    </>
  )
}

type MemoryRouterOpts = Parameters<typeof createMemoryRouter>[1]
