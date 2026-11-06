import {
  type ActiveCampaignsContext,
  BotonicInputContextType,
  getInputContextOfType,
  type PushFlowContext,
} from '../../src'

describe('getInputContextOfType', () => {
  test('returns undefined when context is missing', () => {
    expect(
      getInputContextOfType(undefined, BotonicInputContextType.ActiveCampaigns)
    ).toBeUndefined()
  })

  test('returns undefined when context type does not match', () => {
    expect(
      getInputContextOfType(
        {
          type: BotonicInputContextType.PushFlow,
          campaign_id: 'campaign-1',
          campaign_chat_execution_id: 'execution-1',
          campaign_flow_id: 'flow-1',
        },
        BotonicInputContextType.ActiveCampaigns
      )
    ).toBeUndefined()
  })

  test('returns active campaigns context when type matches', () => {
    const campaigns = [
      {
        id: 'campaign-1',
        name: 'Welcome',
        agent_context: null,
        end_date: null,
      },
    ]
    const context: ActiveCampaignsContext = {
      type: BotonicInputContextType.ActiveCampaigns,
      campaigns_v2: campaigns,
    }

    expect(
      getInputContextOfType(context, BotonicInputContextType.ActiveCampaigns)
    ).toEqual(context)
    expect(
      getInputContextOfType(context, BotonicInputContextType.ActiveCampaigns)
        ?.campaigns_v2
    ).toEqual(campaigns)
  })

  test('returns push flow context when type matches', () => {
    const context: PushFlowContext = {
      type: BotonicInputContextType.PushFlow,
      campaign_id: 'campaign-1',
      campaign_chat_execution_id: 'execution-1',
      campaign_flow_id: 'flow-1',
    }

    expect(
      getInputContextOfType(context, BotonicInputContextType.PushFlow)
    ).toEqual(context)
  })
})
