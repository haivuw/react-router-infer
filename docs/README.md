react-router-infer / [Exports](modules.md)

# react-router-infer

![ci](https://github.com/haivuw/react-router-infer/actions/workflows/ci.yml/badge.svg)

A little type-safer [react-router-dom](https://github.com/remix-run/react-router). Inspired by [@tanstack/router](https://github.com/TanStack/router).

**What's covered**:

- [useParams](/docs/modules.md#useparams)
- [useNavigate](/docs/modules.md#usenavigate)
- [Link](/docs/modules.md#link)
- [NavLink](/docs/modules.md#navlink)
- [useSearch](/docs/modules.md#usesearch)
- [generatePath](/docs/modules.md#generatepath)

## Prerequisites

- `typescript` >= 5.3. This allows `r` helper or `[...] as const sastisfies RouteObject[]` to work. See [this PR](https://github.com/microsoft/TypeScript/pull/55229).
- `react-router-dom` >= 6.0.0. For `Outlet`, `RouteObject`.

## Quick start

Install packages:

```bash
npm install react-router-infer react-router-dom
```

Setup your routes:

```tsx
// 1. Define routes with `r` function. `parseSearch` is added to type URL search params.
const routes = r([
  {
    path: '/',
    children: [
      {
        path: ':id',
        parseSearch: (jsonObject) =>
          z.object({ page: z.number().catch(1) }).parse(jsonObject),
      },
    ],
  },
])

// 2 Register root route:
declare module 'react-router-infer' {
  interface Register {
    routes: CreateRoutes<typeof routes>
  }
}

// 3. Wrap root route with `withSearchParamsProvider` before passing it to `createBrowserRouter` or `useRoutes`:
const router = createBrowserRouter(
  withSearchParamsProvider({
    routes,
    /**
     * Optionally customize search params stringify and parse functions
     *
     * @see https://tanstack.com/router/v1/docs/guide/custom-search-param-serialization
     */
    // stringifySearch,
    // parseSearch
  }),
)

// 4. Use hooks/components from `react-router-infer`:

// useParams
const { id } = useParams({ from: '/:id' }) // from is optional for useParams

// useNavigate/Link
const navigate = useNavigate()
navigate({
  to: '/:id',
  params: {
    id: '123',
  },
  search: {
    page: 1,
  },
})

// useSearch
const { search, setSearch, isInvalidRoute } = useSearch({
  from: '/:id',
})
// search/setSearch can be undefined
if (isInvalidRoute)
  throw new Error('useSearch is being called out of "/:id" route')
// search/setSearch is defined after checking isInvalidRoute
setSearch({
  page: search.page + 1,
})
```

## API & Example

See [the docs](/docs/modules.md) or [the example app](/example/src/App.tsx)
