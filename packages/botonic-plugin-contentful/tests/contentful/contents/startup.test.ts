import {
  Button,
  CommonFields,
  ContentCallback,
  StartUp,
} from '../../../src/cms'
import { testContentful } from '../contentful.helper'
import { TEST_CAROUSEL_MAIN_ID } from './carousel.test'
import { ContentType } from '../../../src/cms/cms'

test('TEST: contentful startUp', async () => {
  const id = 'PfMPIeS6zD1Rix6Px9m0u'
  const startUp = await testContentful().startUp(id)
  expect(startUp).toEqual(
    new StartUp(
      new CommonFields(id, 'BANNER', {
        shortText: 'Bienvenida',
        keywords: ['keyword1'],
      }),

      'https://images.ctfassets.net/p2iyhzd1u4a7/1T0ntgNJnDUSwz59zGMZO6/ed6772d3a7b426025540c879b9d95347/red.jpg',
      'Le damos la bienvenida a su nuevo asistente virtual.',
      [
        new Button(
          TEST_CAROUSEL_MAIN_ID,
          'INICIO',
          'Start menu',
          new ContentCallback(ContentType.CAROUSEL, TEST_CAROUSEL_MAIN_ID)
        ),
      ]
    )
  )
})
