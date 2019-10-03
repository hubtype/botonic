import { BotonicInputTester, BotonicOutputTester } from '@botonic/react'

import App from '../src/app'

let i = new BotonicInputTester(App)
let o = new BotonicOutputTester(App)

test('TEST: hi.js', async () => {
  await expect(i.text('Hi')).resolves.toBe(
    o.text(
      'Hi! Choose what you want to eat:',
      o.replies(
        { text: 'Pizza', payload: 'pizza' },
        { text: 'Pasta', path: 'pasta' }
      )
    )
  )
})

test('TEST: pizza.js', async () => {
  await expect(i.payload('pizza', {}, 'hi')).resolves.toBe(
    o.text(
      'You chose Pizza! Choose one ingredient:',
      o.replies(
        { text: 'Sausage', payload: 'sausage' },
        { text: 'Bacon', payload: 'bacon' }
      )
    )
  )
})

test('TEST: sausage.js', async () => {
  await expect(i.payload('sausage', {}, 'hi/pizza')).resolves.toBe(
    o.text('You chose Sausage on Pizza')
  )
})

test('TEST: bacon.js', async () => {
  await expect(i.path('bacon', {}, 'hi/pizza')).resolves.toBe(
    o.text('You chose Bacon on Pizza')
  )
})

test('TEST: pasta.js', async () => {
  await expect(i.payload('pasta', {}, 'hi')).resolves.toBe(
    o.text(
      'You chose Pasta! Choose one ingredient:',
      o.replies(
        { text: 'Cheese', payload: 'cheese' },
        { text: 'Tomato', payload: 'tomato' }
      )
    )
  )
})

test('TEST: cheese.js', async () => {
  await expect(i.payload('cheese', {}, 'hi/pasta')).resolves.toBe(
    o.text('You chose Cheese on Pasta')
  )
})

test('TEST: tomato.js', async () => {
  await expect(i.path('tomato', {}, 'hi/pasta')).resolves.toBe(
    o.text('You chose Tomato on Pasta')
  )
})

test('TEST: (404) NOT FOUND', async () => {
  await expect(i.text('whatever')).resolves.toBe(
    o.text("I don't understand you")
  )
})
