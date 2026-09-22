import { EventAction, INPUT } from '@botonic/core'
import { describe, expect, test } from 'vitest'

import { FlowDoNothing } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { doNothingFlow } from '../helpers/flows/do-nothing'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Flow do-nothing node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
  })

  test('resolves a terminal do-nothing branch with no further contents', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: doNothingFlow },
      requestArgs: {
        input: { data: 'silentBranch', type: INPUT.TEXT },
      },
    })

    expect(contents).toHaveLength(1)
    expect(contents[0]).toBeInstanceOf(FlowDoNothing)
    const doNothing = contents[0] as FlowDoNothing
    expect(doNothing.id).toBe('do-nothing-node-id')
    expect(doNothing.code).toBe('SILENT_BRANCH')
    expect(doNothing.followUp).toBeNull()
  })

  test('tracks flow_node event for the silent branch', async () => {
    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: doNothingFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: { data: 'silentBranch', type: INPUT.TEXT },
      },
    })

    expect(trackEventMock).toHaveBeenCalledWith(
      expect.anything(),
      EventAction.FlowNode,
      expect.objectContaining({
        flowNodeId: 'do-nothing-node-id',
        flowNodeContentId: 'SILENT_BRANCH',
      })
    )
  })
})
