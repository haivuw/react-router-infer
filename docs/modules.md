[react-router-infer - v0.2.0](README.md) / Exports

# react-router-infer - v0.2.0

## Table of contents

### Type Aliases

- [CreateRoutes](modules.md#createroutes)
- [RouteObject](modules.md#routeobject)

### Functions

- [Link](modules.md#link)
- [NavLink](modules.md#navlink)
- [create\_generatePath](modules.md#create_generatepath)
- [generatePath](modules.md#generatepath)
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

[core.ts:14](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/core.ts#L14)

___

### RouteObject

Ƭ **RouteObject**: `Omit`\<`RR.RouteObject`, ``"children"``\> & \{ `children?`: [`RouteObject`](modules.md#routeobject)[] ; `parseSearch?`: (`raw`: `RawSearch`) => `ParsedSearch`  }

Extends `react-router-dom`'s `RouteObject` with `parseSearch` fields

#### Defined in

[core.ts:35](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/core.ts#L35)

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
      // react-router's NavigateOptions
      replace
      {...rest}
    />
  )
```

#### Defined in

[Link.tsx:24](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/Link.tsx#L24)

___

### NavLink

▸ **NavLink**\<`To`\>(`props`): `Element`

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
    <NavLink
      to='/:id'
      params={{ id: 1 }}
      search={{ page: 1 }}
      // react-router's NavigateOptions
      replace
      {...rest}
    />
  )
```

#### Defined in

[NavLink.tsx:22](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/NavLink.tsx#L22)

___

### create\_generatePath

▸ **create_generatePath**(`opts?`): `GeneratePath`

Return a new `generatePath` function that uses the custom `stringifySearch`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Pick`\<`ParserUtils`, ``"stringifySearch"``\> |

#### Returns

`GeneratePath`

**`Example`**

```ts
const generatePath = create_generatePath({
    stringifySearch: () => '?custom',
  })
```

#### Defined in

[generatePath.ts:26](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/generatePath.ts#L26)

___

### generatePath

▸ **generatePath**\<`Routes`, `To`\>(`to`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Routes` | extends `BaseRoutes` = `BaseRoutes` |
| `To` | extends `string` \| `number` \| `symbol` = keyof `Routes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `NavigateTo`\<`Routes`, `To`\> |

#### Returns

`string`

**`Example`**

```ts
import { redirect } from 'react-router-dom'
  import { generatePath } from 'react-router-infer'

  const path = generatePath({
    to: '/:id',
    params: { id: '1' },
    search: { page: 1 },
  })
  redirect(path)
```

#### Defined in

[generatePath.ts:54](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/generatePath.ts#L54)

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

[core.ts:142](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/core.ts#L142)

___

### useNavigate

▸ **useNavigate**(): `NavigateFunction`\<`BaseRoutes`\>

#### Returns

`NavigateFunction`\<`BaseRoutes`\>

**`Example`**

```ts
const navigate = useNavigate()
  navigate({
    to: '/:id',
    params: { id: 1 },
    // search is always optional
    search: { page: 1 },
    // react-router's NavigateOptions
    replace: true,
    ...rest,
  })
```

#### Defined in

[useNavigate.ts:20](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/useNavigate.ts#L20)

___

### useParams

▸ **useParams**\<`From`\>(`_opts?`): `IsUnion`\<`From`\> extends ``true`` ? `Partial`\<`ParsedParams`\> : `Partial`\<`ParsedParams`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `From` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_opts?` | `ScopeOptions`\<`From`\> |

#### Returns

`IsUnion`\<`From`\> extends ``true`` ? `Partial`\<`ParsedParams`\> : `Partial`\<`ParsedParams`\>

**`Example`**

```ts
const { id } = useParams({
    // the absolute path this hook is called under. Omit to return all params registered.
    from: '/:id',
  })
  // all returned params are optional
```

#### Defined in

[useParams.ts:14](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/useParams.ts#L14)

___

### useSearch

▸ **useSearch**\<`From`, `Throw`\>(`opts`): `UseSearchOutput`\<`BaseRoutes`, `From`, `Throw`, `ParsedSearch`, \{ `isInvalidRoute`: ``false`` ; `search`: `ParsedSearch` ; `setSearch`: (`search`: `ParsedSearch`, `opts?`: `NavigateOptions`) => `void`  }, \{ `isInvalidRoute`: ``true`` ; `search`: `undefined` ; `setSearch`: `undefined`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `From` | extends `string` = `string` |
| `Throw` | extends `boolean` = ``true`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `UseSearchInput`\<`From`, `Throw`\> |

#### Returns

`UseSearchOutput`\<`BaseRoutes`, `From`, `Throw`, `ParsedSearch`, \{ `isInvalidRoute`: ``false`` ; `search`: `ParsedSearch` ; `setSearch`: (`search`: `ParsedSearch`, `opts?`: `NavigateOptions`) => `void`  }, \{ `isInvalidRoute`: ``true`` ; `search`: `undefined` ; `setSearch`: `undefined`  }\>

**`Example`**

```ts
const { search, setSearch, isInvalidRoute } = useSearch({
    // the absolute path this hook is called under.
    from: '/dashboard',
    // whether to throw an error if the route is not rendered.
    // default = true
    throwOnInvalidRoute: false,
  })

  // if `throwOnInvalidRoute` is false, you have to handle the case.
  if (isInvalidRoute) throw YOUR_ERROR

  // search/setSearch is safe to use after the check.
  setSearch(
    // new search state
    { page: search.page + 1 },
    // react-router's NavigateOptions
    {
      replace: true,
    },
  )
```

#### Defined in

[useSearch.ts:31](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/useSearch.ts#L31)

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

[SearchContext.tsx:94](https://github.com/haivuw/react-router-infer/blob/eaa6d1d/src/SearchContext.tsx#L94)
