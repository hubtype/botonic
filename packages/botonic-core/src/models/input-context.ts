export enum BotonicInputContextType {
  PushFlow = 'push_flow',
  ActiveCampaigns = 'active_campaigns',
  LiveChatNewCase = 'live_chat_new_case',
  LiveChatEndUserMessage = 'live_chat_end_user_message',
  LiveChatMessageAck = 'live_chat_message_ack',
  CrmOnResolve = 'crm_on_resolve',
  SalesforceEmbedded = 'salesforce_embedded',
}

export interface PushFlowContext {
  type: BotonicInputContextType.PushFlow
  campaign_chat_execution_id: string
  campaign_id: string
  campaign_flow_id: string
  campaign_follow_up_id?: string
}

export interface CampaignV1Context {
  id: string
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  bot_path: string | null
  template_name: string
  template_language: string
}

export interface CampaignV2Context {
  id: string
  name: string
  agent_context: string | null
  end_date: string | null
}

export interface ActiveCampaignsContext {
  type: BotonicInputContextType.ActiveCampaigns
  campaign?: CampaignV1Context
  campaigns_v2: CampaignV2Context[]
}

export interface ZendeskPostbackAuth {
  email?: string
  api_token?: string
  access_token?: string
}

export interface GenesysPostbackAuth {
  access_token: string
  region: string
  integration_id: string
  context_version: number
  oauth_minted_by: string
}

interface LiveChatProviderFields {
  case_id: string
  zendesk?: ZendeskPostbackAuth
  genesys?: GenesysPostbackAuth
  genesys_conversation_id?: string
  genesys_message_id?: string
}

export interface LiveChatNewCaseContext extends LiveChatProviderFields {
  type: BotonicInputContextType.LiveChatNewCase
}

export interface LiveChatEndUserMessageContext extends LiveChatProviderFields {
  type: BotonicInputContextType.LiveChatEndUserMessage
  message_id: string
  message_text?: string
}

export interface LiveChatMessageAckContext extends LiveChatProviderFields {
  type: BotonicInputContextType.LiveChatMessageAck
  message_id: string
  ack_type: string
}

export interface SalesforceAccessTokenContext {
  access_token: string
}

export interface ZendeskCrmAuthContext {
  email: string
  api_token: string
}

export interface CrmOnResolveContext {
  type: BotonicInputContextType.CrmOnResolve
  case_id: string
  salesforce?: SalesforceAccessTokenContext
  zendesk?: ZendeskCrmAuthContext
}

export interface SalesforceEmbeddedContext {
  type: BotonicInputContextType.SalesforceEmbedded
  salesforce: SalesforceAccessTokenContext
}

export interface BotonicInputContextByType {
  [BotonicInputContextType.PushFlow]: PushFlowContext
  [BotonicInputContextType.ActiveCampaigns]: ActiveCampaignsContext
  [BotonicInputContextType.LiveChatNewCase]: LiveChatNewCaseContext
  [BotonicInputContextType.LiveChatEndUserMessage]: LiveChatEndUserMessageContext
  [BotonicInputContextType.LiveChatMessageAck]: LiveChatMessageAckContext
  [BotonicInputContextType.CrmOnResolve]: CrmOnResolveContext
  [BotonicInputContextType.SalesforceEmbedded]: SalesforceEmbeddedContext
}

export type BotonicInputContext =
  BotonicInputContextByType[BotonicInputContextType]

export type InputContext = BotonicInputContext

export function isInputContextOfType<T extends BotonicInputContextType>(
  context: InputContext | undefined,
  type: T
): context is BotonicInputContextByType[T] {
  return context?.type === type
}

export function getInputContextOfType<T extends BotonicInputContextType>(
  context: InputContext | undefined,
  type: T
): BotonicInputContextByType[T] | undefined {
  return isInputContextOfType(context, type) ? context : undefined
}
