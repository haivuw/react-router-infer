[react-router-infer - v0.0.0](README.md) / Exports

# react-router-infer - v0.0.0

## Table of contents

### Type Aliases

- [CreateRoutes](modules.md#createroutes)
- [RouteObject](modules.md#routeobject)

### Functions

- [Link](modules.md#link)
- [r](modules.md#r)
- [useNavigate](modules.md#usenavigate)
- [useParams](modules.md#useparams)
- [useSearch](modules.md#usesearch)
- [withSearchParamsProvider](modules.md#withsearchparamsprovider)

## Type Aliases

### CreateRoutes

Ƭ **CreateRoutes**\<`T`\>: `IndexByPath`\<`MapChildren`\<`T`\>\>

Maps array of [RouteObject](modules.md#routeobject) to BaseRoutes

**`Example`**

```ts
const routes = [...] as const satisfies RouteObject[]

  declare module 'packageName' {
  register: CreateRoutes<typeof routes>
  }
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`RouteObject`](modules.md#routeobject)[] |

#### Defined in

[core.ts:14](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/core.ts#L14)

___

### RouteObject

Ƭ **RouteObject**: `Omit`\<`RR.RouteObject`, ``"children"``\> & \{ `children?`: [`RouteObject`](modules.md#routeobject)[] ; `parseSearch?`: (`raw`: `RawSearch`) => `ParsedSearch`  }

Extends `react-router-dom`'s `RouteObject` with `parseSearch` fields

#### Defined in

[core.ts:35](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/core.ts#L35)

## Functions

### Link

▸ **Link**\<`To`\>(`props`): `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `To` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `Object` | T |

#### Returns

`Element`

**`Example`**

```ts
const render = (
    <Link
      to='/:id'
      params={{ id: 1 }}
      search={{ page: 1 }}
      // RR.NavigateOptions
      replace
      {...rest}
    />
  )
```

#### Defined in

[Link.tsx:24](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/Link.tsx#L24)

___

### r

▸ **r**\<`T`\>(`routeOrRoutes`): `T`

Create a readonly route object. Same as `{...} as const satisfies
RouteObject`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`RouteObject`](modules.md#routeobject) \| [`RouteObject`](modules.md#routeobject)[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `routeOrRoutes` | `T` |

#### Returns

`T`

**`Example`**

```ts
const singleRoute = r({ path: '/' })
  const allRoutes = r([singleRoute])

  declare module 'x' {
    register: CreateRoutes<typeof allRoutes>
  }
```

#### Defined in

[core.ts:142](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/core.ts#L142)

___

### useNavigate

▸ **useNavigate**\<`Routes`\>(): `NavigateFunction`\<`Routes`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Routes` | extends `BaseRoutes` = `BaseRoutes` |

#### Returns

`NavigateFunction`\<`Routes`\>

**`Example`**

```ts
const navigate = useNavigate()
  navigate({
    to: '/:id',
    params: { id: 1 },
    // search is always optional
    search: { page: 1 },
    // RR.NavigateOptions
    replace: true,
    ...rest,
  })
```

#### Defined in

[useNavigate.ts:20](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/useNavigate.ts#L20)

___

### useParams

▸ **useParams**\<`Routes`, `From`\>(`_opts?`): `IsUnion`\<`From`\> extends ``true`` ? `Partial`\<`GetAllParams`\<`Routes`, ``"params"``\>\> : `Partial`\<`ToObject`\<`Routes`[`From`][``"params"``]\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Routes` | extends `BaseRoutes` = `BaseRoutes` |
| `From` | extends `string` = `string` & keyof `Routes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_opts?` | `ScopeOptions`\<`From`\> |

#### Returns

`IsUnion`\<`From`\> extends ``true`` ? `Partial`\<`GetAllParams`\<`Routes`, ``"params"``\>\> : `Partial`\<`ToObject`\<`Routes`[`From`][``"params"``]\>\>

**`Example`**

```ts
const { id } = useParams({
    // the absolute path this hook is called under. Omit to return all params registered.
    from: '/:id',
  })
  // all returned params are optional
```

#### Defined in

[useParams.ts:14](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/useParams.ts#L14)

___

### useSearch

▸ **useSearch**\<`Routes`, `From`\>(`opts`): `ToObject`\<`Routes`[`From`][``"search"``]\> extends `Search` ? \{ `isInvalidRoute`: ``false`` ; `search`: `Search` ; `setSearch`: (`search`: `Search`, `opts?`: `NavigateOptions`) => `void`  } \| \{ `isInvalidRoute`: ``true`` ; `search`: `undefined` ; `setSearch`: `undefined`  } : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Routes` | extends `BaseRoutes` = `BaseRoutes` |
| `From` | extends `string` = `string` & keyof `Routes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.from` | `From` |

#### Returns

`ToObject`\<`Routes`[`From`][``"search"``]\> extends `Search` ? \{ `isInvalidRoute`: ``false`` ; `search`: `Search` ; `setSearch`: (`search`: `Search`, `opts?`: `NavigateOptions`) => `void`  } \| \{ `isInvalidRoute`: ``true`` ; `search`: `undefined` ; `setSearch`: `undefined`  } : `never`

**`Example`**

```ts
const { search, setSearch, isInvalidRoute } = useSearch({
    // the absolute path this hook is called under.
    from: '/dashboard',
  })

  // search/setSearch can be undefined if `/dashboard` is not rendered. You need to handle that possibility.
  if (isInvalidRoute)
    throw new Error('useParams is called outside of "/has-search-params"')

  // search/setSearch is safe to use after the check.
  setSearch(
    // new search state
    { page: search.page + 1 },
    // RR's NavigateOptions
    {
      replace: true,
    },
  )
```

#### Defined in

[useSearch.ts:29](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/useSearch.ts#L29)

___

### withSearchParamsProvider

▸ **withSearchParamsProvider**(`props`): `RouteObject`[]

Wraps user defined routes with SearchParamsProvider

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Omit`\<`SearchParamsProviderProps`, ``"children"``\> |

#### Returns

`RouteObject`[]

**`Example`**

```ts
// with data router
  const router = createBrowserRouter(withSearchParamsProvider({ routes }))

  // with useRoutes
  const RoutesElement = useRoutes(withSearchParamsProvider({ routes }))

  // custom search parser/stringifier
  withSearchParamsProvider({
    routes,
    parseSearch: () => {},
    stringifySearch: () => {},
  })
```

#### Defined in

[SearchContext.tsx:98](https://github.com/haivuw/react-router-infer/blob/acd70ca/src/SearchContext.tsx#L98)
