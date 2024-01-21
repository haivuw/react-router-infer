# react-router-infer

A little type-safer [react-router-dom](https://github.com/remix-run/react-router). Inspired by [@tanstack/router](https://github.com/TanStack/router).

**What's covered**:

- [useParams](#useParams)
- [useNavigate](#useNavigate)
- [Link](#Link)
- [useSearch](#useSearch)

## Prerequisites

- `typescript` >= 5.3. This allows `r` helper or `[...] as const sastisfies RouteObject[]` to work. See [this PR](https://github.com/microsoft/TypeScript/pull/55229).
- `react-router-dom` >= 6.0.0. For `Outlet`, `RouteObject`.

## Quick start

See [the example app](https://github.com/haivuw/react-router-infer/blob/main/example/src/App.tsx).

1. Install package:

```bash
npm install react-router-infer react-router-dom
```

2. Setup your routes:

```tsx
import {
  type CreateRoutes,
  r,
  withSearchParamsProvider,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-infer'
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
     * @see https://tanstack.com/router/v1/docs/guide/custom-search-param-serialization
     */
    // stringifySearch,
    // parseSearch
  }),
)
```

## API

See [the example app](https://github.com/haivuw/react-router-infer/blob/main/example/src/App.tsx) or [these tests](https://github.com/haivuw/react-router-infer/blob/main/test/register/test-register.tsx) for now.

### useParams

### useNavigate

### Link

### useSearch
