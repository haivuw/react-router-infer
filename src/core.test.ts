import { CreateRoutes } from '.'
import { Equal } from './util'
import { EmptyParams } from './core'
import { Assert } from '../test/util'
import { mixedRoutes } from '../test/mock'

type Routes = CreateRoutes<typeof mixedRoutes>

type a = keyof Routes

type tests = [
  Assert<
    Equal<
      keyof Routes,
      | '/static'
      | '/:dynamic1'
      | '/:dynamic1/:dynamic2'
      | '/:lang?/docs'
      | '/:lang?/docs/:version?'
      | '/splat/*'
      | '/has-search'
      | '/search1'
      | '/has-index'
      | '/has-pathless'
      | '/has-pathless/child'
    >
  >,
  Assert<
    Equal<
      Routes['/:dynamic1/:dynamic2']['params'],
      {
        dynamic1: string
        dynamic2: string
      }
    >
  >,
  Assert<Equal<Routes['/static']['params'], EmptyParams>>,
  Assert<Equal<Routes['/static']['search'], never>>,
  Assert<
    Equal<
      Routes['/has-search']['search'],
      {
        view?: 'grid' | 'list' | undefined
        bool?: boolean | undefined
      }
    >
  >,

  // index routes
  Assert<
    Equal<
      Routes['/has-index']['search'],
      {
        has_index_layout: number
        has_index_index: number
      }
    >
  >,

  // pathless routes
  Assert<
    Equal<
      Routes['/has-pathless/child']['search'],
      {
        has_pathless_pathless: number
        has_pathless_child: number
      }
    >
  >,
]
