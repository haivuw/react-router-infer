import { RegisteredRoutes } from '.'
import { GetAllParams, BaseRoutes, ScopeOptions } from './core'
import * as RR from 'react-router-dom'
import { IsUnion, ToObject } from './util'

/**
 * @example
 *   const { id } = useParams({
 *     // the absolute path this hook is called under. Omit to return all params registered.
 *     from: '/:id',
 *   })
 *   // all returned params are optional
 */
export function useParams<
  Routes extends BaseRoutes = RegisteredRoutes,
  From extends string & keyof Routes = string & keyof Routes,
>(_opts?: ScopeOptions<From>) {
  return RR.useParams() as IsUnion<From> extends true ?
    Partial<GetAllParams<Routes, 'params'>>
  : Partial<ToObject<Routes[From]['params']>>
}
