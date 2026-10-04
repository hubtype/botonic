import { BotonicAction, INPUT, type PluginPreRequest } from '@botonic/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { FlowBuilderApi } from '../src/api'
import { ON_CLOSE_HANDOFF_PAYLOAD, SEPARATOR } from '../src/constants'
import {
  DiscardType,
  type HtHandoffNode,
} from '../src/content-fields/hubtype-fields/index'
import { HtNodeWithContentType } from '../src/content-fields/hubtype-fields/node-types'
import { FlowHandoff, type FlowText } from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockQueueAvailability } from './__mocks__/conditional-queue'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import {
  DIFFERENTIATED_HANDOFF_ID,
  DISCARDED_BY_AGENT_TEXT_ID,
  DISCARDED_BY_SYSTEM_TEXT_ID,
  DISCARDED_BY_USER_TEXT_ID,
  handoffCloseFlow,
  LEGACY_HANDOFF_ID,
  LEGACY_HANDOFF_TARGET_ID,
  RESOLVED_BY_AGENT_TEXT_ID,
} from './helpers/flows/handoff-close'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

const cmsApiStub = {
  getPayload: (target?: { id: string }) => target?.id,
  getResolvedLocale: () => 'en',
} as FlowBuilderApi

const textLink = (id: string) => ({
  id,
  type: HtNodeWithContentType.TEXT,
})

function buildHandoffNode(
  overrides: Partial<HtHandoffNode> & Pick<HtHandoffNode, 'id'>
): HtHandoffNode {
  return {
    code: 'HANDOFF',
    meta: { x: 0, y: 0 },
    follow_up: undefined,
    target: undefined,
    flow_id: 'flow-id',
    is_meaningful: false,
    type: HtNodeWithContentType.HANDOFF,
    content: {
      queue: [{ id: 'queue-id', name: 'General', locale: 'en' }],
      payload: [],
      has_auto_assign: false,
      has_queue_position_changed_notifications_enabled: false,
      has_differentiated_close_types: false,
    },
    ...overrides,
  }
}

function onCloseHandoffPayload(handoffId: string): string {
  return `${ON_CLOSE_HANDOFF_PAYLOAD}${SEPARATOR}${handoffId}`
}

function getOnFinishPayload(request: PluginPreRequest): string | undefined {
  const action = request.session._botonic_action
  if (!action?.startsWith(`${BotonicAction.CreateCase}:`)) {
    return undefined
  }
  const params = JSON.parse(
    action.slice(`${BotonicAction.CreateCase}:`.length)
  ) as { on_finish?: string }
  return params.on_finish
}

function setContactReasons(request: PluginPreRequest, names: string[]): void {
  request.session._hubtype_case_contact_reasons = names.map(name => ({
    id: `reason-${name}`,
    name,
    project_id: 'project-1',
  }))
}

describe('FlowHandoff.fromHubtypeCMS', () => {
  test('with differentiated close types sets onFinishPayload to fb-on-close-handoff|id and copies close links', () => {
    const handoff = FlowHandoff.fromHubtypeCMS(
      buildHandoffNode({
        id: DIFFERENTIATED_HANDOFF_ID,
        content: {
          queue: [{ id: 'queue-id', name: 'General', locale: 'en' }],
          payload: [],
          has_auto_assign: false,
          has_queue_position_changed_notifications_enabled: false,
          has_differentiated_close_types: true,
          resolved_by_agent: textLink(RESOLVED_BY_AGENT_TEXT_ID),
          discarded_by_agent: textLink(DISCARDED_BY_AGENT_TEXT_ID),
          discarded_by_user: textLink(DISCARDED_BY_USER_TEXT_ID),
          discarded_by_system: textLink(DISCARDED_BY_SYSTEM_TEXT_ID),
        },
      }),
      'en',
      cmsApiStub
    )

    expect(handoff.onFinishPayload).toBe(
      onCloseHandoffPayload(DIFFERENTIATED_HANDOFF_ID)
    )
    expect(handoff.resolvedByAgent).toEqual(textLink(RESOLVED_BY_AGENT_TEXT_ID))
    expect(handoff.discardedByAgent).toEqual(
      textLink(DISCARDED_BY_AGENT_TEXT_ID)
    )
    expect(handoff.discardedByUser).toEqual(textLink(DISCARDED_BY_USER_TEXT_ID))
    expect(handoff.discardedBySystem).toEqual(
      textLink(DISCARDED_BY_SYSTEM_TEXT_ID)
    )
  })

  test('without differentiated close types uses target payload when target exists', () => {
    const handoff = FlowHandoff.fromHubtypeCMS(
      buildHandoffNode({
        id: LEGACY_HANDOFF_ID,
        target: textLink(LEGACY_HANDOFF_TARGET_ID),
        content: {
          queue: [{ id: 'queue-id', name: 'General', locale: 'en' }],
          payload: [],
          has_auto_assign: false,
          has_queue_position_changed_notifications_enabled: false,
          has_differentiated_close_types: false,
        },
      }),
      'en',
      cmsApiStub
    )

    expect(handoff.onFinishPayload).toBe(LEGACY_HANDOFF_TARGET_ID)
  })

  test('without differentiated close types and without target leaves onFinishPayload undefined', () => {
    const handoff = FlowHandoff.fromHubtypeCMS(
      buildHandoffNode({
        id: LEGACY_HANDOFF_ID,
        content: {
          queue: [{ id: 'queue-id', name: 'General', locale: 'en' }],
          payload: [],
          has_auto_assign: false,
          has_queue_position_changed_notifications_enabled: false,
          has_differentiated_close_types: false,
        },
      }),
      'en',
      cmsApiStub
    )

    expect(handoff.onFinishPayload).toBeUndefined()
  })

  test('sets followUp to undefined even when CMS provides follow_up', () => {
    const handoff = FlowHandoff.fromHubtypeCMS(
      buildHandoffNode({
        id: DIFFERENTIATED_HANDOFF_ID,
        follow_up: textLink(RESOLVED_BY_AGENT_TEXT_ID),
        content: {
          queue: [{ id: 'queue-id', name: 'General', locale: 'en' }],
          payload: [],
          has_auto_assign: false,
          has_queue_position_changed_notifications_enabled: false,
          has_differentiated_close_types: true,
          resolved_by_agent: textLink(RESOLVED_BY_AGENT_TEXT_ID),
        },
      }),
      'en',
      cmsApiStub
    )

    expect(handoff.followUp).toBeUndefined()
  })
})

describe('FlowHandoff.resolveOnClosePayload', () => {
  function handoffWithCloseLinks(
    links: Partial<{
      resolvedByAgent: string
      discardedByAgent: string
      discardedByUser: string
      discardedBySystem: string
    }>
  ): FlowHandoff {
    return FlowHandoff.fromHubtypeCMS(
      buildHandoffNode({
        id: DIFFERENTIATED_HANDOFF_ID,
        content: {
          queue: [{ id: 'queue-id', name: 'General', locale: 'en' }],
          payload: [],
          has_auto_assign: false,
          has_queue_position_changed_notifications_enabled: false,
          has_differentiated_close_types: true,
          resolved_by_agent: links.resolvedByAgent
            ? textLink(links.resolvedByAgent)
            : undefined,
          discarded_by_agent: links.discardedByAgent
            ? textLink(links.discardedByAgent)
            : undefined,
          discarded_by_user: links.discardedByUser
            ? textLink(links.discardedByUser)
            : undefined,
          discarded_by_system: links.discardedBySystem
            ? textLink(links.discardedBySystem)
            : undefined,
        },
      }),
      'en',
      cmsApiStub
    )
  }

  test.each([
    [DiscardType.ByAgent, DISCARDED_BY_AGENT_TEXT_ID],
    [DiscardType.ByUser, DISCARDED_BY_USER_TEXT_ID],
    [DiscardType.BySystem, DISCARDED_BY_SYSTEM_TEXT_ID],
  ])(
    'returns the link target for discard reason %s',
    (reasonName, expectedTargetId) => {
      const handoff = handoffWithCloseLinks({
        resolvedByAgent: RESOLVED_BY_AGENT_TEXT_ID,
        discardedByAgent: DISCARDED_BY_AGENT_TEXT_ID,
        discardedByUser: DISCARDED_BY_USER_TEXT_ID,
        discardedBySystem: DISCARDED_BY_SYSTEM_TEXT_ID,
      })
      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
      })
      setContactReasons(request, [reasonName])

      expect(handoff.resolveOnClosePayload(request)).toBe(expectedTargetId)
    }
  )

  test('returns resolved_by_agent when there are no contact reasons', () => {
    const handoff = handoffWithCloseLinks({
      resolvedByAgent: RESOLVED_BY_AGENT_TEXT_ID,
    })
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })

    expect(handoff.resolveOnClosePayload(request)).toBe(
      RESOLVED_BY_AGENT_TEXT_ID
    )
  })

  test('returns resolved_by_agent when contact reason is not a discard type', () => {
    const handoff = handoffWithCloseLinks({
      resolvedByAgent: RESOLVED_BY_AGENT_TEXT_ID,
    })
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })
    setContactReasons(request, ['billing'])

    expect(handoff.resolveOnClosePayload(request)).toBe(
      RESOLVED_BY_AGENT_TEXT_ID
    )
  })

  test('prefers discarded over other discard reasons when several are present', () => {
    const handoff = handoffWithCloseLinks({
      resolvedByAgent: RESOLVED_BY_AGENT_TEXT_ID,
      discardedByAgent: DISCARDED_BY_AGENT_TEXT_ID,
      discardedByUser: DISCARDED_BY_USER_TEXT_ID,
    })
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })
    setContactReasons(request, [DiscardType.ByUser, DiscardType.ByAgent])

    expect(handoff.resolveOnClosePayload(request)).toBe(
      DISCARDED_BY_AGENT_TEXT_ID
    )
  })

  test('logs an error and falls back to resolved_by_agent when discard reason has no link', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const handoff = handoffWithCloseLinks({
      resolvedByAgent: RESOLVED_BY_AGENT_TEXT_ID,
    })
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })
    setContactReasons(request, ['discarded'])

    expect(handoff.resolveOnClosePayload(request)).toBe(
      RESOLVED_BY_AGENT_TEXT_ID
    )
    expect(consoleError).toHaveBeenCalledWith(
      'No discarded by agent target found'
    )
    consoleError.mockRestore()
  })

  test('throws when resolved_by_agent is missing and no discard link applies', () => {
    const handoff = handoffWithCloseLinks({})
    const request = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })

    expect(() => handoff.resolveOnClosePayload(request)).toThrow(
      'No resolved by agent target found'
    )
  })
})

describe('plugin.pre resolveOnCloseHandoffPayload', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockSmartIntent('Other')
    mockQueueAvailability({ isOpen: true, name: 'HandoffCloseQueue' })
  })

  test.each([
    [
      DiscardType.ByAgent,
      DISCARDED_BY_AGENT_TEXT_ID,
      'Case discarded by agent',
    ],
    [DiscardType.ByUser, DISCARDED_BY_USER_TEXT_ID, 'Case discarded by user'],
    [
      DiscardType.BySystem,
      DISCARDED_BY_SYSTEM_TEXT_ID,
      'Case discarded by system',
    ],
    [undefined, RESOLVED_BY_AGENT_TEXT_ID, 'Case resolved by agent'],
  ])(
    'rewrites on-close handoff payload for contact reason %s',
    async (reasonName, expectedPayload, expectedText) => {
      const initialPayload = onCloseHandoffPayload(DIFFERENTIATED_HANDOFF_ID)
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: handoffCloseFlow,
      })
      const request = createRequest({
        input: { payload: initialPayload, type: INPUT.POSTBACK },
        plugins: { flowBuilderPlugin },
      })
      if (reasonName) {
        setContactReasons(request, [reasonName])
      }

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )

      expect(request.input.payload).toBe(expectedPayload)
      expect((contents[0] as FlowText).text).toBe(expectedText)
    }
  )

  test('does not rewrite payloads that are not on-close handoff payloads', async () => {
    const payload = RESOLVED_BY_AGENT_TEXT_ID
    const { request, contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: handoffCloseFlow },
      requestArgs: {
        input: { payload, type: INPUT.POSTBACK },
      },
    })

    expect(request.input.payload).toBe(payload)
    expect((contents[0] as FlowText).text).toBe('Case resolved by agent')
  })

  test('keeps payload when handoff id does not exist', async () => {
    const payload = onCloseHandoffPayload(
      '00000000-0000-4000-8000-000000009999'
    )
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: handoffCloseFlow,
    })
    const request = createRequest({
      input: { payload, type: INPUT.POSTBACK },
    })

    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBe(payload)
  })

  test('keeps payload when id points to a non-handoff node', async () => {
    const payload = onCloseHandoffPayload(RESOLVED_BY_AGENT_TEXT_ID)
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: handoffCloseFlow,
    })
    const request = createRequest({
      input: { payload, type: INPUT.POSTBACK },
    })

    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBe(payload)
  })
})

describe('handoff on_finish payload after queue is open', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockSmartIntent('Other')
    mockQueueAvailability({ isOpen: true, name: 'HandoffCloseQueue' })
  })

  test('legacy handoff uses target id as on_finish', async () => {
    const { request, contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: handoffCloseFlow },
      requestArgs: {
        input: { data: 'legacyHandoff', type: INPUT.TEXT },
      },
    })

    expect((contents.at(-1) as FlowHandoff).id).toBe(LEGACY_HANDOFF_ID)
    expect(getOnFinishPayload(request)).toBe(LEGACY_HANDOFF_TARGET_ID)
  })

  test('differentiated handoff uses fb-on-close-handoff payload as on_finish', async () => {
    const { request, contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: handoffCloseFlow },
      requestArgs: {
        input: { data: 'diffHandoff', type: INPUT.TEXT },
      },
    })

    expect((contents.at(-1) as FlowHandoff).id).toBe(DIFFERENTIATED_HANDOFF_ID)
    expect(getOnFinishPayload(request)).toBe(
      onCloseHandoffPayload(DIFFERENTIATED_HANDOFF_ID)
    )
  })
})
