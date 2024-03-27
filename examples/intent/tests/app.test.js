import {
  BotonicInputTester,
  BotonicOutputTester,
  NodeApp,
} from '@botonic/react'

import { config } from '../src/'
import { locales } from '../src/locales'
import { routes } from '../src/routes'

const app = new NodeApp({ routes, locales, ...config })

const input = new BotonicInputTester(app)
const output = new BotonicOutputTester(app)

test('TEST: (404) NOT FOUND', async () => {
  const response = await input.text('whatever')
  expect(response).toBe(output.text(
    // replace with  'Try typing "hello" to start the bot.' after configuring dialogflow
    `Enter the generated JSON key for dialogflowV2 in plugins.js to test the bot.`
  ))
})
