import { config } from '../src/'
import { routes } from '../src/routes'
import { locales } from '../src/locales'

import {
  BotonicInputTester,
  BotonicOutputTester,
  NodeApp,
} from '@botonic/react'

const app = new NodeApp({ routes, locales, ...config })

const i = new BotonicInputTester(app)
const o = new BotonicOutputTester(app)

test('TEST: (404) NOT FOUND', async () => {
  await expect(i.text('whatever')).resolves.toBe(
    o.text(
      `Enter the generated JSON key for dialogflowV2 in plugins.js to test the bot. Try typing "hello" to start the bot.`
    )
  )
})
