import { routes, plugins, locales, config } from '../src/'
import {
  BotonicInputTester,
  BotonicOutputTester,
  NodeApp,
} from '@botonic/react'

const app = new NodeApp({ routes, locales, plugins, ...config })

const i = new BotonicInputTester(app)
const o = new BotonicOutputTester(app)

test('TEST: (404) NOT FOUND', async () => {
  await expect(i.text('whatever')).resolves.toBe(
    o.text('Please, type "start" to start the tutorial.')
  )
})
