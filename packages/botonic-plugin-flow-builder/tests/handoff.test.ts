import { INPUT } from '@botonic/core'
import { describe, expect, jest, test } from '@jest/globals'
import type { HtHandoffNode } from '../src/content-fields/hubtype-fields'
import {
  FlowHandoff,
  FlowQueueStatusConditional,
  type FlowText,
} from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { LanguageDetectionApi } from '../src/user-input'
// eslint-disable-next-line jest/no-mocks-import
import { mockQueueAvailability } from './__mocks__/conditional-queue'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
} from './helpers/utils'

function getHandoffParams(botonicAction?: string) {
  return JSON.parse(botonicAction?.split(':').slice(1).join(':') || '{}')
}

describe('Check the content returned by the plugin, when the queue is open', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockQueueAvailability({ isOpen: true, name: 'General' }))

  test('The content connected to the status queue open is displayed and a handoff is done', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'agent', type: INPUT.TEXT },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowQueueStatusConditional)
    expect((contents[1] as FlowText).text).toBe(
      'Soon you will be served by a human agent'
    )
    expect(contents[2]).toBeInstanceOf(FlowHandoff)
    expect(request.session._botonic_action).toBeDefined()
  })
})

describe('The content connected to the closed queue status is displayed and the handoff is not done', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockQueueAvailability({ isOpen: false, name: 'General' }))

  test('The content connected to the node before the handoff node is displayed and a handoff is done.', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'agent', type: INPUT.TEXT },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowQueueStatusConditional)
    expect((contents[1] as FlowText).text).toBe(
      'At the moment we are out of office hours'
    )
    expect(request.session._botonic_action).toBeUndefined()
  })
})

describe('Language detection before handoff', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    jest.restoreAllMocks()
    mockQueueAvailability({ isOpen: true, name: 'General' })
  })

  test('includes the detected locale in handoff extra data when already available', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: {
        data: 'handoff',
        payload: 'handoff',
        type: INPUT.TEXT,
      },
      user: {
        locale: 'es',
        country: 'ES',
        systemLocale: 'es',
        languageDetected: true,
      },
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)

    const handoffNode = flowBuilderPlugin.cmsApi.getNodeById<HtHandoffNode>(
      '07947391-3460-45fb-a195-2c2e12483ad3'
    )
    const flowHandoff = FlowHandoff.fromHubtypeCMS(
      handoffNode,
      'en',
      flowBuilderPlugin.cmsApi
    )

    await flowHandoff.doHandoff(request)

    const params = getHandoffParams(request.session._botonic_action)

    expect(params.case_extra_data).toEqual({
      language: 'es',
    })
  })

  test('detects the language during handoff when it was not detected before', async () => {
    const detectLanguageSpy = jest
      .spyOn(LanguageDetectionApi.prototype, 'detectLanguage')
      .mockResolvedValue({
        detected_language: 'es',
        confidence: 0.9,
      })
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: {
        data: 'Hola',
        payload: 'handoff',
        type: INPUT.TEXT,
      },
      user: { languageDetected: false },
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)

    const handoffNode = flowBuilderPlugin.cmsApi.getNodeById<HtHandoffNode>(
      '07947391-3460-45fb-a195-2c2e12483ad3'
    )
    const flowHandoff = FlowHandoff.fromHubtypeCMS(
      handoffNode,
      'en',
      flowBuilderPlugin.cmsApi
    )

    await flowHandoff.doHandoff(request)

    const params = getHandoffParams(request.session._botonic_action)

    expect(detectLanguageSpy).toHaveBeenCalledWith('Hola')
    expect(request.session.user.locale).toBe('es')
    expect(request.session.user.language_detected).toBe(true)
    expect(params.case_extra_data).toEqual({
      language: 'es',
    })
  })

  test('does not add locale to handoff extra data when confidence is too low', async () => {
    jest
      .spyOn(LanguageDetectionApi.prototype, 'detectLanguage')
      .mockResolvedValue({
        detected_language: 'es',
        confidence: 0.7,
      })
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: {
        data: 'Hola',
        payload: 'handoff',
        type: INPUT.TEXT,
      },
      user: { languageDetected: false },
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)

    const handoffNode = flowBuilderPlugin.cmsApi.getNodeById<HtHandoffNode>(
      '07947391-3460-45fb-a195-2c2e12483ad3'
    )
    const flowHandoff = FlowHandoff.fromHubtypeCMS(
      handoffNode,
      'en',
      flowBuilderPlugin.cmsApi
    )

    await flowHandoff.doHandoff(request)

    const params = getHandoffParams(request.session._botonic_action)

    expect(request.session.user.language_detected).toBe(false)
    expect(params.case_extra_data).toEqual({
      language: 'en',
    })
  })

  test('continues with the handoff when language detection fails', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest
      .spyOn(LanguageDetectionApi.prototype, 'detectLanguage')
      .mockImplementation(async () => {
        const error = new Error('boom')
        console.warn('Error detecting user language', error)
        return null
      })
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: {
        data: 'Hola',
        payload: 'handoff',
        type: INPUT.TEXT,
      },
      user: { languageDetected: false },
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)

    const handoffNode = flowBuilderPlugin.cmsApi.getNodeById<HtHandoffNode>(
      '07947391-3460-45fb-a195-2c2e12483ad3'
    )
    const flowHandoff = FlowHandoff.fromHubtypeCMS(
      handoffNode,
      'en',
      flowBuilderPlugin.cmsApi
    )

    await flowHandoff.doHandoff(request)

    const params = getHandoffParams(request.session._botonic_action)

    expect(warnSpy).toHaveBeenCalledWith(
      'Error detecting user language',
      expect.any(Error)
    )
    expect(params.case_extra_data).toEqual({
      language: 'en',
    })
    expect(request.session._botonic_action).toBeDefined()
  })
})
