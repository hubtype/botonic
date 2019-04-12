import { BotonicInputTester, BotonicOutputTester } from '@botonic/react'
import * as contentful from 'botonic-plugin-contentful'
// var contentful = require('botonic-plugin-contentful')

import App from '../src/app'

let i = new BotonicInputTester(App)
let o = new BotonicOutputTester(App)

test('TEST: (404) NOT FOUND', async () => {
  // let p = new plugin();
  console.log("kkkkkkkk2");
  let r = new contentful.Renderer();
  r.richMessage();
  await expect(i.text('whatever')).resolves.toBe(
    o.text('Please, type "start" to start the tutorial.')
  )
})
