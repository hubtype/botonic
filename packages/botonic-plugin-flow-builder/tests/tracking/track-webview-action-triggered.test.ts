import { EventAction, INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowCarousel, FlowText } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { openWebviewFlow } from '../helpers/flows/open-webview'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track webview action triggered', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
  })

  test('should track webview action triggered, when a text has a button that targets an Open Webview node', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: openWebviewFlow, trackEvent: trackEventMock },
      requestArgs: {
        isFirstInteraction: true,
        input: {
          type: INPUT.TEXT,
          data: 'Hello',
        },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowText)

    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      EventAction.FlowNode,
      expect.anything()
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      EventAction.WebviewActionTriggered,
      {
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeContentId: 'Test Webview',
        flowNodeId: '019ab584-d30d-777f-bfb2-2912f74744dc',
        flowNodeIsMeaningful: false,
        flowThreadId: expect.anything(),
        webviewName: 'TestWebview',
        webviewTargetId: '0199102d-90b9-771d-a927-7329bd348a5e',
      }
    )
  })

  test('should track webview action triggered, when a carousel has an element with a button that targets an Open Webview node', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: openWebviewFlow, trackEvent: trackEventMock },
      requestArgs: {
        input: {
          type: INPUT.TEXT,
          data: 'carousel',
        },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowCarousel)

    expect(trackEventMock).toHaveBeenCalledTimes(3)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      EventAction.Keyword,
      expect.anything()
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      EventAction.FlowNode,
      expect.anything()
    )
    expect(trackEventMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      EventAction.WebviewActionTriggered,
      {
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeContentId: 'Test Webview',
        flowNodeId: '019ab584-d30d-777f-bfb2-2912f74744dc',
        flowNodeIsMeaningful: false,
        flowThreadId: expect.anything(),
        webviewName: 'TestWebview',
        webviewTargetId: '0199102d-90b9-771d-a927-7329bd348a5e',
      }
    )
  })
})
