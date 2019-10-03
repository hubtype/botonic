import { BotonicInputTester, BotonicOutputTester } from '@botonic/react'

import App from '../src/app'

let i = new BotonicInputTester(App)
let o = new BotonicOutputTester(App)

test('TEST: (404) NOT FOUND', async () => {
  await expect(i.text('whatever')).resolves.toBe(
    o.text(
      'Enter the dialogflow token in integrations.js to test the bot. Try typing "hello" to start the bot.'
    )
  )
})
