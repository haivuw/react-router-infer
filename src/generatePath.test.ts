import { describe, expect, test } from 'bun:test'
import { GeneratePath, create_generatePath, generatePath } from './generatePath'
import { CreateRoutes, r } from './core'
import { expectTypeOf } from '../test/util'

const routes = r([
  {
    path: ':id',
    parseSearch: () => ({ page: 1 }),
  },
])

type Routes = CreateRoutes<typeof routes>

const _generatePath = generatePath as GeneratePath<Routes>

describe('generatePath', () => {
  test('default', () => {
    const path = _generatePath<'/:id'>({
      to: '/:id',
      params: { id: '1' },
      search: { page: 1 },
    })

    console.log(path)
    expect(path).toBe('/1?page=1')
  })

  test('create_generatePath', () => {
    const generatePath = create_generatePath<Routes>({
      stringifySearch: () => '?custom',
    })
    const path = generatePath({
      to: '/:id',
      params: { id: '1' },
      search: { page: 1 },
    })

    expect(path).toBe('/1?custom')
    expectTypeOf(generatePath).toEqualTypeOf<GeneratePath<Routes>>()
  })
})
