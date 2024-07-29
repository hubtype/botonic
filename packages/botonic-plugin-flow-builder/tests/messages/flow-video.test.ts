import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowVideo } from '../../src/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents of a video node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The src of the video is in contents', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: { input: { data: 'flowVideo', type: INPUT.TEXT } },
    })

    const firstContent = contents[0] as FlowVideo
    expect(firstContent.src).toBe('https://www.youtube.com/watch?v=M11dw4o3Au4')
  })
})
