import { BotonicInputContextType, type PushFlowContext } from '@botonic/core'

export function createTestPushFlowContext(
  campaignId: string,
  overrides?: Partial<Omit<PushFlowContext, 'type' | 'campaign_id'>>
): PushFlowContext {
  return {
    type: BotonicInputContextType.PushFlow,
    campaign_id: campaignId,
    campaign_chat_execution_id: 'test-chat-execution-id',
    campaign_flow_id: 'test-flow-id',
    ...overrides,
  }
}
