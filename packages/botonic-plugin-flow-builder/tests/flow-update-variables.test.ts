import { EventAction, INPUT } from '@botonic/core'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { FlowUpdateVariables } from '../src/content-fields/flow-update-variables'
import { HtNodeWithContentType } from '../src/content-fields/hubtype-fields/node-types'
import type { HtUpdateVariablesNode } from '../src/content-fields/hubtype-fields/update-variables'
import { ContactInfoFieldsClient } from '../src/services/contact-info-fields-api'
import { ProcessEnvNodeEnvs, type TrackEventFunction } from '../src/types'
import { getFlowBuilderPlugin } from '../src/utils/get-flow-builder-plugin'
import { trackEventMock } from './__mocks__/track-event'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getActionRequest,
} from './helpers/utils'

const mockUpdate = jest.fn(
  async (
    _chatId: string,
    _fieldName: string,
    _value: string | number | boolean
  ) => undefined
)
const mockDelete = jest.fn(
  async (_chatId: string, _fieldName: string) => undefined
)

jest.mock('../src/services/contact-info-fields-api', () => ({
  ContactInfoFieldsClient: jest.fn().mockImplementation(() => ({
    update: mockUpdate,
    delete: mockDelete,
  })),
}))

const ContactInfoFieldsClientMock = ContactInfoFieldsClient as jest.MockedClass<
  typeof ContactInfoFieldsClient
>

function createMockUpdateVariablesNode(
  content: HtUpdateVariablesNode['content']
): HtUpdateVariablesNode {
  return {
    id: 'update-variables-node-id',
    code: 'UPDATE_VARIABLES',
    meta: { x: 0, y: 0 },
    flow_id: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
    is_meaningful: false,
    type: HtNodeWithContentType.UPDATE_VARIABLES,
    content,
  }
}

function createBotContext(
  contactInfo: { name: string; type: string; value: string }[] = [],
  options?: {
    trackEvent?: TrackEventFunction
    extraNodes?: HtUpdateVariablesNode[]
  }
) {
  const flow = options?.extraNodes
    ? { ...basicFlow, nodes: [...basicFlow.nodes, ...options.extraNodes] }
    : basicFlow
  const flowBuilderPlugin = createFlowBuilderPlugin({
    flow,
    trackEvent: options?.trackEvent,
  })
  const request = createRequest({
    input: { data: 'test', type: INPUT.TEXT },
    plugins: { flowBuilderPlugin },
    contactInfo,
  })
  return getActionRequest(request)
}

describe('FlowUpdateVariables.fromHubtypeCMS', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockUpdate.mockClear()
    mockDelete.mockClear()
    ContactInfoFieldsClientMock.mockClear()
    trackEventMock.mockClear()
  })

  test('sets contact_info in session and syncs to backend', async () => {
    const node = createMockUpdateVariablesNode({
      set_variables: {
        'session.user.contact_info.email': 'a@b.com',
      },
      unset_variables: [],
    })
    const botContext = createBotContext()

    await FlowUpdateVariables.fromHubtypeCMS(node, botContext)

    expect(botContext.session.user.contact_info).toEqual([
      { name: 'email', type: 'string', value: 'a@b.com' },
    ])
    expect(mockUpdate).toHaveBeenCalledWith('uid1', 'email', 'a@b.com')
    expect(mockDelete).not.toHaveBeenCalled()
    expect(ContactInfoFieldsClientMock).toHaveBeenCalledTimes(1)
  })

  test('unsets contact_info in session and deletes on backend', async () => {
    const node = createMockUpdateVariablesNode({
      set_variables: {},
      unset_variables: ['session.user.contact_info.email'],
    })
    const botContext = createBotContext([
      { name: 'email', type: 'string', value: 'old@b.com' },
    ])

    await FlowUpdateVariables.fromHubtypeCMS(node, botContext)

    expect(botContext.session.user.contact_info).toEqual([])
    expect(mockDelete).toHaveBeenCalledWith('uid1', 'email')
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(ContactInfoFieldsClientMock).toHaveBeenCalledTimes(1)
  })

  test('updates generic session paths without calling contact_info API', async () => {
    const node = createMockUpdateVariablesNode({
      set_variables: {
        'session.customFlag': true,
      },
      unset_variables: [],
    })
    const botContext = createBotContext()

    await FlowUpdateVariables.fromHubtypeCMS(node, botContext)

    expect((botContext.session as { customFlag?: boolean }).customFlag).toBe(
      true
    )
    expect(ContactInfoFieldsClientMock).not.toHaveBeenCalled()
  })

  test('does not call backend when there are no contact_info fields', async () => {
    const node = createMockUpdateVariablesNode({
      set_variables: {
        'session.nested.value': 42,
      },
      unset_variables: [],
    })
    const botContext = createBotContext()

    await FlowUpdateVariables.fromHubtypeCMS(node, botContext)

    expect(
      (botContext.session as { nested?: { value: number } }).nested
    ).toEqual({
      value: 42,
    })
    expect(ContactInfoFieldsClientMock).not.toHaveBeenCalled()
  })

  test('processContent tracks the update variables record and does not sync contact_info again', async () => {
    const setVariables = {
      'session.user.contact_info.phone': '123',
      'session.customFlag': true,
    }
    const unsetVariables = ['session.user.phone']
    const node = createMockUpdateVariablesNode({
      set_variables: setVariables,
      unset_variables: unsetVariables,
    })
    const botContext = createBotContext([], {
      trackEvent: trackEventMock,
      extraNodes: [node],
    })

    const flowUpdateVariables = await FlowUpdateVariables.fromHubtypeCMS(
      node,
      botContext
    )

    mockUpdate.mockClear()
    mockDelete.mockClear()
    ContactInfoFieldsClientMock.mockClear()
    trackEventMock.mockClear()

    botContext.input.payload = 'already-resolved'
    await getFlowBuilderPlugin(botContext.plugins).pre(botContext)
    await flowUpdateVariables.processContent(botContext)

    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
    expect(ContactInfoFieldsClientMock).not.toHaveBeenCalled()
    expect(trackEventMock).toHaveBeenCalledWith(
      botContext,
      EventAction.UpdateVariables,
      expect.objectContaining({
        flowId: node.flow_id,
        flowName: 'Main',
        flowNodeId: node.id,
        flowNodeContentId: node.code,
        flowNodeIsMeaningful: false,
        setVariables,
        unsetVariables,
      })
    )
  })
})
