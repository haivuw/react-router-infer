import { UseParams, useParams } from './useParams'
import { dynamicRoutes, optionalParamsRoutes, splatRoutes } from '../test/mock'
import { CreateRoutes } from '.'
import { describe, test } from 'bun:test'
import { Assert } from '../test/util'
import { Equal } from './util'

describe('useParams', () => {
  test('nested', async () => {
    type Routes = CreateRoutes<typeof dynamicRoutes>
    type params = ReturnType<UseParams<Routes>>
    type tests = [
      Assert<
        Equal<
          params,
          {
            dynamic1?: string | undefined
            dynamic2?: string | undefined
          }
        >
      >,
    ]
  })

  test('optional params', async () => {
    type Routes = CreateRoutes<typeof optionalParamsRoutes>
    type params = ReturnType<UseParams<Routes>>
    type tests = [
      Assert<
        Equal<
          params,
          {
            lang?: string | undefined
            version?: string | undefined
          }
        >
      >,
    ]
  })

  test('splat params', async () => {
    type Routes = CreateRoutes<typeof splatRoutes>
    type params = ReturnType<UseParams<Routes>>
    type tests = [
      Assert<
        Equal<
          params,
          {
            '*'?: string | undefined
          }
        >
      >,
    ]
  })
})
