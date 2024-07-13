import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowCarousel } from '../../src/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents of a carousel node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The contents of the carousel and elements are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: { input: { data: 'flowCarousel', type: INPUT.TEXT } },
    })

    const carouselContent = contents[0] as FlowCarousel
    const carouselElements = carouselContent.elements

    const firstElement = carouselElements[0]
    expect(firstElement.title).toBe('Title element 1')
    expect(firstElement.subtitle).toBe('Subtitle element 1')
    expect(firstElement.image).toBe(
      'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/9415a943-286f-4b69-a983-f4a4ca59b6dc/bola4estrellas.png'
    )

    const buttonFirstElement = firstElement.button
    expect(buttonFirstElement?.text).toBe('Button to url')
    expect(buttonFirstElement?.url).toBe('https://www.hubtype.com')
    expect(buttonFirstElement?.payload).toBeUndefined()

    const secondElement = carouselElements[1]
    expect(secondElement.title).toBe('Title element 2')
    expect(secondElement.subtitle).toBe('Subtitle element 2')
    expect(secondElement.image).toBe(
      'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/9415a943-286f-4b69-a983-f4a4ca59b6dc/Vermut.jpeg'
    )

    const buttonSecondElement = secondElement.button
    expect(buttonSecondElement?.text).toBe('Button text 2')
    expect(buttonSecondElement?.payload).toBe(
      'bff4c6de-06b2-411a-9d13-0fd3c08ce34f'
    )
    expect(buttonSecondElement?.url).toBeUndefined()
  })
})
