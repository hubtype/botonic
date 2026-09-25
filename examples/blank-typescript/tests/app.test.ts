import { expect, test } from 'vitest'

import { config } from '../src/index.js'
import { routes } from '../src/routes.js'

test('routes start empty', () => {
  expect(routes).toEqual([])
})

test('config sets default timing', () => {
  expect(config).toEqual({ defaultDelay: 0, defaultTyping: 0 })
})
