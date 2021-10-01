import { testContentful, testContext } from '../contentful.helper'

const CUSTOM_TEST = '5kqsVkXbN7ZnXXbUIiaWso'

test('TEST: contentful custom with custom fields', async () => {
  const sut = testContentful()
  const custom = await sut.custom(CUSTOM_TEST, testContext()) // actually returns the fallback language (es)
  expect(custom.fields).toEqual({
    customJson: { width: '100' },
    customText: "Hi, I'm a custom text!",
    customBoolean: true,
  })
})
