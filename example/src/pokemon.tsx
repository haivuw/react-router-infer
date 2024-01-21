import { NamedAPIResource, PokemonClient } from 'pokenode-ts'
import { Link, r, useSearch } from 'react-router-infer'
import useSWR from 'swr'
import * as v from 'valibot'

const imgUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

const client = new PokemonClient()

const Pokemon = (props: { pokemon: NamedAPIResource }) => {
  const {
    pokemon: { name },
  } = props

  const { data } = useSWR(['pokemon-by-name', name], async ([, name]) => {
    return client.getPokemonByName(name)
  })

  return (
    <div className='flex flex-col items-center'>
      {/** */}
      <strong className='text-slate-500'>{name}</strong>
      <img className='w-full' src={imgUrl(data?.id ?? 0)} />
    </div>
  )
}

const PokemonPage = () => {
  const { search, isInvalidRoute } = useSearch({ from: '/pokemon' })

  if (isInvalidRoute) throw 'useSearch'
  const { data } = useSWR(
    ['list-pokemons', search.page, search.perPage],
    async ([, page, perPage]) => {
      return client.listPokemons(
        // offset
        (page - 1) * perPage,
        // limit
        perPage,
      )
    },
  )

  return (
    <div className='rounded p-4 bg-slate-50'>
      <div className='flex gap-4 items-end'>
        <h1>/pokemon</h1>
        <div className='mb-[2px] flex gap-4'>
          <Link
            to='/pokemon'
            search={{
              ...search,
              page: search.page !== 1 ? search.page - 1 : 1,
            }}
          >
            Back
          </Link>
          <Link
            to='/pokemon'
            search={{
              ...search,
              page: search.page + 1,
            }}
          >
            Next
          </Link>
          <Link
            replace
            to='/pokemon'
            search={{
              ...search,
              view: search.view === 'grid' ? 'list' : 'grid',
            }}
          >
            View
          </Link>
        </div>
      </div>

      <div
        className={
          search.view === 'grid' ?
            'grid grid-cols-4 gap-4'
          : 'flex flex-col gap-4'
        }
      >
        {data?.results.map((pokemon) => (
          <div key={pokemon.name} className='max-w-40'>
            <Pokemon pokemon={pokemon} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const pokemonRoute = r({
  path: 'pokemon',
  element: <PokemonPage />,
  parseSearch: (raw) => {
    const schema = v.object({
      perPage: v.optional(v.number(), 20),
      page: v.optional(v.number(), 1),
      view: v.optional(v.union([v.literal('list'), v.literal('grid')]), 'grid'),
    })
    return v.parse(schema, raw)
  },
})
