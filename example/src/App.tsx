/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type CreateRoutes,
  r,
  withSearchParamsProvider,
} from 'react-router-infer'
import {
  createBrowserRouter,
  RouterProvider,
  // BrowserRouter,
  // useRoutes,
} from 'react-router-dom'
import { ALL_ROUTES } from './routes'

// 1. Wrap all routes with `r` function. Same effect as `as const satisfies RouteObject[]`
const routes = r(ALL_ROUTES)

// 2. Register routes type:
declare module 'react-router-infer' {
  interface Register {
    routes: CreateRoutes<typeof routes>
  }
}

// 3. Wrap routes with `withSearchParamsProvider` before passing it to `createBrowserRouter` or `useRoutes`:
const router = createBrowserRouter(
  withSearchParamsProvider({
    routes: routes,
    /**
     * Optionally customize search params stringify and parse functions
     *
     * @see https://tanstack.com/router/v1/docs/guide/custom-search-param-serialization
     */
    // stringifySearch,
    // parseSearch
  }),
)

export default function App() {
  return <RouterProvider router={router} />
}

// OR using `useRoutes`:

// const Routes = () =>
//   useRoutes(
//     withSearchParamsProvider({
//       routes: routes,
//     }),
//   )

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes />
//     </BrowserRouter>
//   )
// }
