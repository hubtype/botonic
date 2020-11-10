import {
  BotonicInputTester,
  BotonicOutputTester,
  NodeApp,
} from '@botonic/react'

import { config } from '../src/'
import { locales } from '../src/locales'
import { routes } from '../src/routes'

const app = new NodeApp({ routes, locales, ...config })

const i = new BotonicInputTester(app)
const o = new BotonicOutputTester(app)

test('TEST: (404) NOT FOUND', async () => {
  await expect(i.text('whatever')).resolves.toBe(
    o.text(
      // replace with  'Try typing "hello" to start the bot.' after configuring dialogflow
      `Enter the generated JSON key for dialogflowV2 in plugins.js to test the bot.`
    )
  )
})
