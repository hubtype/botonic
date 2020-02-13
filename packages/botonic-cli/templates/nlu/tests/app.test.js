import { routes, locales, config } from '../src/'
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
    o.text("I don't understand you")
  )
})
