import {
  Button,
  CommonFields,
  ContentCallback,
  StartUp,
} from '../../../src/cms'
import { ContentType } from '../../../src/cms/cms'
import { testContentful } from '../contentful.helper'
import { TEST_CAROUSEL_MAIN_ID } from './carousel.test'

test('TEST: contentful startUp', async () => {
  const id = 'PfMPIeS6zD1Rix6Px9m0u'
  const startUp = await testContentful().startUp(id)
  const startUpButton = new Button(
    TEST_CAROUSEL_MAIN_ID,
    'INICIO',
    'Start menu',
    new ContentCallback(ContentType.CAROUSEL, TEST_CAROUSEL_MAIN_ID, {
      id: '2yR9f3stNAEqdamUr8VtfD',
      name: 'INICIO',
      text: 'Start menu',
    })
  )
  startUpButton.customFields = { customFieldNumber: 3.14159265389 }
  expect(startUp).toEqual(
    new StartUp(
      new CommonFields(id, 'BANNER', {
        shortText: 'Bienvenida',
        keywords: ['keyword1'],
        customFields: { customFieldText: 'Some text' },
      }),

      'https://images.ctfassets.net/p2iyhzd1u4a7/1T0ntgNJnDUSwz59zGMZO6/8f114c3d3fe8f541fefbec5a539dad35/red.jpg',
      'Le damos la bienvenida a su nuevo asistente virtual.',
      [startUpButton]
    )
  )
})
