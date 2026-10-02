import { INPUT, PROVIDER, WhatsappInputOrigin } from '@botonic/core'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { BotContextManager } from '../src/bot-context-manager'
import {
  EMPTY_PAYLOAD,
  ON_CLOSE_HANDOFF_PAYLOAD,
  SEPARATOR,
  SOURCE_INFO_SEPARATOR,
} from '../src/constants'
import { FlowHandoff } from '../src/content-fields'
import { HtNodeWithContentType } from '../src/content-fields/hubtype-fields'
import { getNextPayloadByUserInput } from '../src/user-input'
import type { SmartIntentsInferenceConfig } from '../src/user-input/smart-intent'
import {
  asFlowBuilderApi,
  createMockFlowBuilderApi,
  type MockFlowBuilderApi,
} from './helpers/mock-cms-api'
import { createRequest } from './helpers/utils'

jest.mock('../src/user-input', () => ({
  getNextPayloadByUserInput: jest.fn(),
}))

const mockedGetNextPayload = getNextPayloadByUserInput as jest.MockedFunction<
  typeof getNextPayloadByUserInput
>

const smartIntentsConfig: SmartIntentsInferenceConfig = {
  useLatest: false,
}

const NODE_UUID = '11111111-1111-4111-8111-111111111111'
const HANDOFF_ID = 'handoff-id'

describe('BotContextManager.prepareInputForRoutes', () => {
  let cmsApi: MockFlowBuilderApi
  let botContextManager: BotContextManager

  beforeEach(() => {
    jest.clearAllMocks()
    cmsApi = createMockFlowBuilderApi()
    botContextManager = new BotContextManager(
      asFlowBuilderApi(cmsApi),
      smartIntentsConfig
    )
  })

  describe('WhatsApp empty payload', () => {
    test('converts EMPTY_PAYLOAD with referral into a text input', async () => {
      const referral = 'What is the weather like?'
      const botContext = createRequest({
        provider: PROVIDER.WHATSAPP,
        input: {
          type: INPUT.POSTBACK,
          payload: `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}0`,
          referral,
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(botContext.input.type).toBe(INPUT.TEXT)
      expect(botContext.input.data).toBe(referral)
    })
  })

  describe('Push flow first interaction', () => {
    test('sets is_first_interaction to false when the payload is a push flow', async () => {
      cmsApi.isPushFlowPayload.mockReturnValue(true)
      const botContext = createRequest({
        isFirstInteraction: true,
        input: {
          type: INPUT.POSTBACK,
          payload: 'push-flow|flow-id',
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(botContext.session.is_first_interaction).toBe(false)
    })
  })

  describe('WhatsApp contact request', () => {
    test('assigns the contact node target payload and clears the contact request id', async () => {
      const target = { id: 'contact-target' }
      cmsApi.getWhatsappRequestContactInfoNode.mockReturnValue({
        content: { button: { target } },
      })
      cmsApi.getPayload.mockReturnValue('contact-target-payload')
      const botContext = createRequest({
        input: {
          type: INPUT.CONTACT,
          origin: WhatsappInputOrigin.ContactRequest,
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(cmsApi.getPayload).toHaveBeenCalledWith(target)
      expect(botContext.input.payload).toBe('contact-target-payload')
      expect(cmsApi.removeWhatsappRequestContactId).toHaveBeenCalledTimes(1)
    })
  })

  describe('On-close handoff', () => {
    test('replaces the on-close payload with the resolved handoff payload', async () => {
      const resolveOnClosePayload = jest
        .fn()
        .mockReturnValue('resolved-payload')
      jest.spyOn(FlowHandoff, 'fromHubtypeCMS').mockReturnValue({
        resolveOnClosePayload,
      } as unknown as FlowHandoff)
      cmsApi.getNodeById.mockReturnValue({
        id: HANDOFF_ID,
        type: HtNodeWithContentType.HANDOFF,
      })
      const botContext = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: `${ON_CLOSE_HANDOFF_PAYLOAD}${SEPARATOR}${HANDOFF_ID}`,
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(FlowHandoff.fromHubtypeCMS).toHaveBeenCalled()
      expect(resolveOnClosePayload).toHaveBeenCalledWith(botContext)
      expect(botContext.input.payload).toBe('resolved-payload')
    })
  })

  describe('Free text without payload', () => {
    test('assigns the payload returned by getNextPayloadByUserInput', async () => {
      mockedGetNextPayload.mockResolvedValue('next-payload')
      const botContext = createRequest({
        input: {
          type: INPUT.TEXT,
          data: 'hello',
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(mockedGetNextPayload).toHaveBeenCalledWith(
        asFlowBuilderApi(cmsApi),
        'en',
        botContext,
        smartIntentsConfig
      )
      expect(botContext.input.payload).toBe('next-payload')
    })

    test('does not resolve user text when the input already has a payload', async () => {
      const botContext = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: 'existing-payload',
          data: 'hello',
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(mockedGetNextPayload).not.toHaveBeenCalled()
      expect(botContext.input.payload).toBe('existing-payload')
    })
  })

  describe('removeCaptureUserInputId', () => {
    test('clears capture user input once at the end of prepareInputForRoutes', async () => {
      const botContext = createRequest({
        captureUserInputId: 'capture-node',
        input: {
          type: INPUT.POSTBACK,
          payload: 'some-payload',
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(cmsApi.removeCaptureUserInputId).toHaveBeenCalledTimes(1)
    })
  })

  describe('removePayloadSourceSuffix', () => {
    test('strips the source suffix before checking bot actions', async () => {
      const botContext = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: `${NODE_UUID}${SOURCE_INFO_SEPARATOR}2`,
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(botContext.input.payload).toBe(NODE_UUID)
      expect(cmsApi.isBotAction).toHaveBeenCalledWith(NODE_UUID)
    })
  })

  describe('resolveBotActionPayload', () => {
    test('replaces a bot action node id with the payload that includes params', async () => {
      const botActionNode = {
        id: NODE_UUID,
        type: HtNodeWithContentType.BOT_ACTION,
      }
      cmsApi.isBotAction.mockReturnValue(true)
      cmsApi.getNodeById.mockReturnValue(botActionNode)
      cmsApi.createPayloadWithParams.mockReturnValue('rating|{"value":1}')
      const botContext = createRequest({
        input: {
          type: INPUT.POSTBACK,
          payload: NODE_UUID,
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(cmsApi.getNodeById).toHaveBeenCalledWith(NODE_UUID)
      expect(cmsApi.createPayloadWithParams).toHaveBeenCalledWith(botActionNode)
      expect(botContext.input.payload).toBe('rating|{"value":1}')
    })

    test('reconverts a WhatsApp EMPTY_PAYLOAD produced by a bot action when a referral exists', async () => {
      const referral = 'agent question'
      cmsApi.isBotAction.mockReturnValue(true)
      cmsApi.getNodeById.mockReturnValue({
        id: NODE_UUID,
        type: HtNodeWithContentType.BOT_ACTION,
      })
      cmsApi.createPayloadWithParams.mockReturnValue(
        `${EMPTY_PAYLOAD}${SOURCE_INFO_SEPARATOR}0`
      )
      const botContext = createRequest({
        provider: PROVIDER.WHATSAPP,
        input: {
          type: INPUT.POSTBACK,
          payload: NODE_UUID,
          referral,
        },
      })

      await botContextManager.prepareInputForRoutes(botContext)

      expect(botContext.input.type).toBe(INPUT.TEXT)
      expect(botContext.input.data).toBe(referral)
    })
  })
})
