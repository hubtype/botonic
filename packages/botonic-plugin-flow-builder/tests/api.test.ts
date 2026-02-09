import { INPUT } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'

import type { HtNodeWithContent } from '../src/content-fields/hubtype-fields'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { campaignsFlow } from './helpers/flows/campaigns'
import { createFlowBuilderPlugin, createRequest } from './helpers/utils'

describe('FlowBuilderApi - Campaign methods', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  describe('getNodeByCampaignId', () => {
    test('should return the start node for a valid campaign ID', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const campaignNode =
        cmsApi.getNodeByCampaignId<HtNodeWithContent>('campaign-uuid-1')

      expect(campaignNode).toBeDefined()
      expect(campaignNode.id).toBe('campaign-1-start-node')
      expect(campaignNode.code).toBe('CAMPAIGN_1_START')
      expect(campaignNode.type).toBe('text')
    })

    test('should return the start node for campaign 2', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const campaignNode =
        cmsApi.getNodeByCampaignId<HtNodeWithContent>('campaign-uuid-2')

      expect(campaignNode).toBeDefined()
      expect(campaignNode.id).toBe('campaign-2-start-node')
      expect(campaignNode.code).toBe('CAMPAIGN_2_START')
    })

    test('should throw error when campaign ID does not exist', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      expect(() => {
        cmsApi.getNodeByCampaignId('non-existent-campaign')
      }).toThrow("Campaign with id: 'non-existent-campaign' not found")
    })
  })

  describe('getCampaignFlowName', () => {
    test('should return campaign name for valid campaign ID', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const campaignName = cmsApi.getCampaignFlowName('campaign-uuid-1')

      expect(campaignName).toBe('Summer Sale')
    })

    test('should return campaign 2 name', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const campaignName = cmsApi.getCampaignFlowName('campaign-uuid-2')

      expect(campaignName).toBe('Product Launch')
    })

    test('should return empty string for non-existent campaign ID', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const campaignName = cmsApi.getCampaignFlowName('non-existent-campaign')

      expect(campaignName).toBe('')
    })
  })

  describe('getFlowName', () => {
    test('should return flow name for regular flow ID', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const flowName = cmsApi.getFlowName('main-flow')

      expect(flowName).toBe('Main')
    })

    test('should fallback to campaign name when flow ID is not found', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      // When flow is not found, it should try to get campaign name
      const flowName = cmsApi.getFlowName('campaign-uuid-1')

      expect(flowName).toBe('Summer Sale')
    })

    test('should return empty string when neither flow nor campaign exists', async () => {
      const flowBuilderPlugin = createFlowBuilderPlugin({
        flow: campaignsFlow,
      })

      const request = createRequest({
        input: { data: 'test', type: INPUT.TEXT },
        plugins: {
          flowBuilderPlugin,
        },
      })

      await flowBuilderPlugin.pre(request)
      const cmsApi = flowBuilderPlugin.cmsApi

      const flowName = cmsApi.getFlowName('non-existent-id')

      expect(flowName).toBe('')
    })
  })
})
