import { BotonicInputTester, BotonicOutputTester } from '@botonic/react'

import App from '../src/app'

let i = new BotonicInputTester(App)
let o = new BotonicOutputTester(App)

test('TEST: (404) NOT FOUND', async () => {
  await expect(i.text('whatever')).resolves.toBe(
    o.text("I don't understand you")
  )
})
