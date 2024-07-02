import { INPUT, Input, ResolvedPlugin } from '@botonic/core'

import { HtNodeWithContent } from '../src/content-fields/hubtype-fields'
import BotonicPluginFlowBuilder from '../src/index'
import { FlowBuilderJSONVersion, ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import { createRequest } from './helpers/utils'

describe('The user clicks on a button that is connected to a BotActionNode', () => {
  test('The button has  a payload equal to ba|botActionUuid', async () => {
    process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
    const flowBuilderPlugin = new BotonicPluginFlowBuilder({
      apiUrl: undefined,
      jsonVersion: FlowBuilderJSONVersion.DRAFT,
      flow: basicFlow as any,
      customFunctions: {},
      getLocale: () => 'en',
      getAccessToken: () => 'fake_token',
      trackEvent: () => Promise.resolve(expect.any(Function)),
      getKnowledgeBaseResponse: () => Promise.resolve(expect.any(Function)),
      smartIntentsConfig: { numSmartIntentsToUse: 5 },
    })

    // @ts-expect-error 1234
    flowBuilderPlugin.id = 'flowBuilder'
    // @ts-expect-error 1234
    flowBuilderPlugin.name = 'BotonicPluginFlowBuilder'
    // @ts-expect-error 1234
    flowBuilderPlugin.config = {}

    const textInput: Input = {
      type: INPUT.TEXT,
      data: 'hello',
      payload: undefined,
    }
    let request = createRequest({
      input: textInput,
      plugins: {
        flowBuilderPlugin: flowBuilderPlugin as unknown as ResolvedPlugin,
      },
    })

    if (flowBuilderPlugin.pre) {
      await flowBuilderPlugin.pre(request)
    }

    const payloadInput: Input = {
      type: INPUT.POSTBACK,
      data: undefined,
      payload: 'ba|85dbeb56-81c9-419d-a235-4ebf491b4fc9',
    }

    request = createRequest({
      input: payloadInput,
      plugins: {
        flowBuilderPlugin: flowBuilderPlugin as unknown as ResolvedPlugin,
      },
    })

    if (flowBuilderPlugin.pre) {
      await flowBuilderPlugin.pre(request)
    }

    const node = flowBuilderPlugin.cmsApi.getNodeByContentID(
      'SERVED_BY_HUMAN_AGENT'
    )

    await flowBuilderPlugin.getContentsByNode(node as HtNodeWithContent, 'en')

    const anotherNode = flowBuilderPlugin.getContentsByContentID(
      'ADD_BAG_MSG',
      'en'
    )

    flowBuilderPlugin.getUUIDByContentID('ADD_BAG_MSG')

    flowBuilderPlugin.getStartContents('en')

    const functionNode =
      flowBuilderPlugin.cmsApi.getNodeByContentID('QUEUE-STATUS_48')

    await flowBuilderPlugin.getContentsByNode(
      functionNode as HtNodeWithContent,
      'en'
    )

    const carouselNode =
      flowBuilderPlugin.cmsApi.getNodeByContentID('CAROUSEL_65')
    await flowBuilderPlugin.getContentsByNode(
      carouselNode as HtNodeWithContent,
      'en'
    )

    const imageNode = flowBuilderPlugin.cmsApi.getNodeByContentID('IMAGE_16')
    await flowBuilderPlugin.getContentsByNode(
      imageNode as HtNodeWithContent,
      'en'
    )
    const videoNode = flowBuilderPlugin.cmsApi.getNodeByContentID('VIDEO_74')
    await flowBuilderPlugin.getContentsByNode(
      videoNode as HtNodeWithContent,
      'en'
    )

    const whatsappButtonListNode = flowBuilderPlugin.cmsApi.getNodeByContentID(
      'WHATSAPP_BUTTON_LIST'
    )
    await flowBuilderPlugin.getContentsByNode(
      whatsappButtonListNode as HtNodeWithContent,
      'en'
    )

    const whatsappCTAUrlButtonNode =
      flowBuilderPlugin.cmsApi.getNodeByContentID('WHATSAPP_URL_CTA_BUTTON')

    await flowBuilderPlugin.getContentsByNode(
      whatsappCTAUrlButtonNode as HtNodeWithContent,
      'en'
    )

    flowBuilderPlugin.getPayloadParams(
      'payload-with-params|{"followUpContentId": "{}"}'
    )
    flowBuilderPlugin.getFlowName('1234')
  })
})
