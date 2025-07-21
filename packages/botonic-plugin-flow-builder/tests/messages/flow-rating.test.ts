import { INPUT, InputType, Session, storeCaseRating } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { AGENT_RATING_PAYLOAD } from '../../src/constants'
import { RatingType } from '../../src/content-fields/hubtype-fields/index'
import { FlowRating, FlowText } from '../../src/content-fields/index'
import { EventAction } from '../../src/tracking'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { ratingFlow } from '../helpers/flows/rating'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from '../helpers/utils'

jest.mock('@botonic/core', () => {
  const actual = jest.requireActual('@botonic/core') as any
  return {
    ...actual,
    storeCaseRating: jest.fn((_session, _value) => {
      return Promise.resolve({ status: 'ok' })
    }),
  }
})

describe('Rating', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
    ;(storeCaseRating as jest.Mock).mockClear()
  })

  test('The contents of the rating message are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: ratingFlow },
      requestArgs: { input: { data: 'rating', type: INPUT.TEXT } },
    })

    const ratingMessage = contents[0] as FlowRating
    expect(ratingMessage.text).toBe('Rate the human agent')

    const openListButtonText = ratingMessage.openListButtonText
    expect(openListButtonText).toBe('Rating Options')

    const sendButtonText = ratingMessage.sendButtonText
    expect(sendButtonText).toBe('Send')

    const ratingType = ratingMessage.ratingType
    expect(ratingType).toBe(RatingType.Stars)

    const buttons = ratingMessage.buttons
    expect(buttons.length).toBe(5)

    const firstButton = buttons[0]
    expect(firstButton.text).toBe('⭐️ ⭐️ ⭐️ ⭐️ ⭐️')
    expect(firstButton.payload).toBe(
      `${AGENT_RATING_PAYLOAD}|01980ec7-88d3-714c-852b-fd70729d3c39`
    )

    const secondButton = buttons[1]
    expect(secondButton.text).toBe('⭐️ ⭐️ ⭐️ ⭐️')
    expect(secondButton.payload).toBe(
      `${AGENT_RATING_PAYLOAD}|01980ec7-88d3-714c-852c-03bc8d6cf3d1`
    )

    const thirdButton = buttons[2]
    expect(thirdButton.text).toBe('⭐️ ⭐️ ⭐️')
    expect(thirdButton.payload).toBe(
      `${AGENT_RATING_PAYLOAD}|01980ec7-88d3-714c-852c-06a2bb713c77`
    )

    const fourthButton = buttons[3]
    expect(fourthButton.text).toBe('⭐️ ⭐️')
    expect(fourthButton.payload).toBe(
      `${AGENT_RATING_PAYLOAD}|01980ec7-88d3-714c-852c-095ec611b92a`
    )

    const fifthButton = buttons[4]
    expect(fifthButton.text).toBe('⭐️')
    expect(fifthButton.payload).toBe(
      `${AGENT_RATING_PAYLOAD}|01980ec7-88d3-714c-852c-0df6b7bffeac`
    )
  })

  test('When user clicks on a rating button, the rating is tracked and the plugin display the text connected to the button', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: ratingFlow,
      trackEvent: trackEventMock,
    })

    const fourStarsPayload = 'agent-rating|01980ec7-88d3-714c-852c-03bc8d6cf3d1'
    const requestArgs = {
      input: {
        type: INPUT.POSTBACK as InputType,
        payload: fourStarsPayload,
      },
      hubtypeCaseId: '123',
    }

    const request = createRequest({
      ...requestArgs,
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBe(
      `${AGENT_RATING_PAYLOAD}|01980ec7-88d3-714c-852c-03bc8d6cf3d1`
    )

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )
    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'feedback_case',
      {
        action: EventAction.FeedbackCase,
        feedbackTargetId: '123',
        feedbackGroupId: expect.anything(),
        possibleOptions: [
          '⭐️ ⭐️ ⭐️ ⭐️ ⭐️',
          '⭐️ ⭐️ ⭐️ ⭐️',
          '⭐️ ⭐️ ⭐️',
          '⭐️ ⭐️',
          '⭐️',
        ],
        possibleValues: [5, 4, 3, 2, 1],
        option: '⭐️ ⭐️ ⭐️ ⭐️',
        value: 4,
      }
    )

    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'flow_node',
      {
        flowThreadId: expect.anything(),
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeId: '0197f9be-5244-767e-a90e-fa2b6a9055fd',
        flowNodeContentId: 'heigh-rating-msg',
        flowNodeIsMeaningful: false,
      }
    )

    expect(storeCaseRating).toHaveBeenCalledTimes(1)
    expect(storeCaseRating).toHaveBeenCalledWith(expect.anything(), 4)

    const textMessage = contents[0] as FlowText
    expect(textMessage.text).toBe('Thanks')
  })
})
