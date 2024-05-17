import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowVideo } from '../../src/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from '../helpers/utils'

describe('Check the contents of a video node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(basicFlow)

  test('The src of the video is in contents', async () => {
    const request = createRequest({
      input: { data: 'flowVideo', type: INPUT.TEXT },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )
    const firstContent = contents[0] as FlowVideo
    expect(firstContent.src).toBe('https://www.youtube.com/watch?v=M11dw4o3Au4')
  })
})
