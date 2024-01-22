/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'
import { r } from '../src'

export const staticRoutes = r([
  {
    path: 'static',
    element: null,
  },
])

export const dynamicRoutes = r([
  {
    path: ':dynamic1',
    element: null,
    children: [
      {
        path: ':dynamic2',
        element: null,
      },
    ],
  },
])

export const optionalParamsRoutes = r([
  {
    path: ':lang?/docs',
    element: null,
    children: [
      {
        path: ':version?',
        element: null,
      },
    ],
  },
])

export const splatRoutes = r([
  {
    element: null,
    path: 'splat/*',
  },
])

export const searchParamsRoutes = r([
  {
    path: 'has-search',
    element: null,
    parseSearch: (raw) => {
      return z
        .object({
          view: z
            .union([z.literal('grid'), z.literal('list')])
            .optional()
            .catch('list'),
          bool: z.boolean().optional(),
        })
        .parse(raw)
    },
  },
])

export const searchParamsRoutes1 = r([
  {
    path: 'search1',
    parseSearch: (raw) => {
      return z
        .object({
          nested: z.object({
            a: z.string().optional(),
            b: z.array(z.string()).optional(),
          }),
        })
        .parse(raw)
    },
  },
])

export const hasIndexRoutes = r([
  {
    path: 'has-index',
    parseSearch: (raw) => ({
      has_index_layout: 1,
    }),
    children: [
      {
        parseSearch: (raw) => ({
          has_index_index: 1,
        }),
        index: true,
        element: null,
      },
    ],
  },
])

export const pathlessRoutes = r([
  {
    path: 'has-pathless',
    children: [
      {
        parseSearch: (raw) => ({
          has_pathless_pathless: 1,
        }),
        children: [
          {
            parseSearch: (raw) => ({
              has_pathless_child: 1,
            }),
            path: 'child',
          },
        ],
      },
    ],
  },
])

export const mixedRoutes = r([
  ...staticRoutes,
  ...dynamicRoutes,
  ...optionalParamsRoutes,
  ...splatRoutes,
  ...searchParamsRoutes,
  ...searchParamsRoutes1,
  ...hasIndexRoutes,
  ...pathlessRoutes,
])
