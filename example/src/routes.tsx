import {
  useParams,
  useNavigate,
  useSearch,
  r,
  Link,
  NavLink,
} from 'react-router-infer'
import * as v from 'valibot'
import { Outlet } from 'react-router-dom'
import { pokemonRoute } from './pokemon'

function RootIndexPage() {
  const { search, isInvalidRoute } = useSearch({ from: '/' })
  if (isInvalidRoute) return

  return (
    <div className='bg-slate-50 p-4 rounded'>
      <h1>/</h1>
      <pre>{JSON.stringify(search)}</pre>
    </div>
  )
}

function RootLayout() {
  return (
    <>
      <div className='container mx-auto px-4 py-4'>
        <nav className='flex gap-3'>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='/book'>Books</NavLink>
          <NavLink to='/pokemon'>Pokemon</NavLink>
        </nav>
        <Outlet />
      </div>
    </>
  )
}

function BookIndexPage() {
  const params = useParams()
  const nav = useNavigate()
  const { search, setSearch, isInvalidRoute } = useSearch({
    from: '/book',
  })
  if (isInvalidRoute) return

  return (
    <div className='bg-slate-50 p-4 rounded'>
      <h1>/book</h1>
      <div className='flex flex-col gap-4'>
        <div>
          <pre>{JSON.stringify({ params, search }, null, 2)}</pre>
          <div className='flex gap-4'>
            <button
              className={search.page === 1 ? 'cursor-not-allowed' : ''}
              disabled={search.page === 1}
              onClick={() =>
                nav({
                  to: '/book',
                  search: {
                    ...search,
                    page: search.page - 1,
                  },
                  replace: true,
                })
              }
            >
              <a>Back(navigate)</a>
            </button>
            <Link
              to='/book'
              search={{ ...search, page: search.page + 1 }}
              replace
            >
              Next(Link)
            </Link>
            <button
              onClick={() => {
                setSearch(
                  {
                    ...search,
                    view: search.view === 'list' ? 'grid' : 'list',
                  },
                  {
                    replace: true,
                  },
                )
              }}
            >
              <a>Toggle View(setSearch)</a>
            </button>
          </div>
        </div>

        <div>
          <nav className='flex gap-3'>
            <Link to='/book/:bookId' params={{ bookId: 'A' }} search={search}>
              Book A
            </Link>
            <Link to='/book/:bookId' params={{ bookId: 'B' }} search={search}>
              Book B
            </Link>
          </nav>
          <div className='ml-8 mt-8'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

const BookIdPage = () => {
  const params = useParams()
  const { search, isInvalidRoute } = useSearch({
    from: '/book/:bookId',
  })
  if (isInvalidRoute) return
  return (
    <div className='bg-slate-100 p-4 rounded'>
      <h2>/book/:bookId</h2>
      <pre>{JSON.stringify({ params, search }, null, 2)}</pre>
    </div>
  )
}

export const bookRoute = r({
  path: 'book',
  element: <BookIndexPage />,
  parseSearch: (raw) => {
    const schema = v.object({
      page: v.optional(v.number(), 1),
      pageSize: v.optional(v.number(), 10),
      view: v.optional(v.union([v.literal('list'), v.literal('grid')]), 'list'),
    })
    return v.parse(schema, raw)
  },
  children: [
    {
      path: ':bookId',
      element: <BookIdPage />,
    },
  ],
})

export const rootIndexRoute = r({
  index: true,
  parseSearch: (raw) => {
    const schema = v.object({
      rootIndexSearch: v.optional(v.string()),
    })
    return v.parse(schema, raw)
  },
  element: <RootIndexPage />,
})

export const ALL_ROUTES = r([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      //
      rootIndexRoute,
      bookRoute,
      pokemonRoute,
    ],
  },
])
