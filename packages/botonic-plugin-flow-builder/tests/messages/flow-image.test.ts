import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowImage } from '../../src/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents of a image node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The src of the image is in contents', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: { input: { data: 'flowImage', type: INPUT.TEXT } },
    })

    const firstContent = contents[0] as FlowImage
    expect(firstContent.src).toBe(
      'https://medias.ent0.flowbuilder.prod.hubtype.com/assets/media_files/825f22e5-421e-4d8d-bdd9-2fb9c6f6e4cb/9415a943-286f-4b69-a983-f4a4ca59b6dc/link-2.png'
    )
  })
})
