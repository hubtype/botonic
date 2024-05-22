import { PROVIDER } from '@botonic/core'

export enum EventType {
  feedback = 'feedback',
  flow = 'botevent',
}

export type EventAction = FeedbackAction | FlowAction | HandoffAction

export interface HtBaseEventProps {
  action: EventAction
}

export interface EventFeedback extends HtBaseEventProps {
  action: FeedbackAction
  data: EventPropsFeedback
}

export interface EventPropsFeedback {
  messageGeneratedBy?: string
  feedbackTargetId?: string
  feedbackGroupId?: string
  possibleOptions: string[]
  possibleValues: number[]
  option: string
  value: number
}

export enum FeedbackAction {
  case = 'feedback_case',
  message = 'feddback_message',
  conversation = 'feddback_conversation',
  webview = 'feddback_webview',
}

export interface EventFlow extends HtBaseEventProps {
  action: FlowAction
  data: EventPropsFlow
}

export interface EventPropsFlow {
  flowThreadId: string
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
  flowNodeIsMeaningful?: boolean
}

export enum FlowAction {
  flowNode = 'flow_node',
}

export interface EventHandoff extends HtBaseEventProps {
  action: HandoffAction
  data: EventPropsHandoff
}

export interface EventPropsHandoff {
  queueId: string
  queueName: string
  caseId?: string
  isQueueOpen?: boolean
  isAvailableAgent?: boolean
  isThresholdReached?: boolean
}

export enum HandoffAction {
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
}

export type HtEventProps = EventFeedback | EventFlow | EventHandoff

export interface RequestData {
  language: string
  country: string
  provider: PROVIDER
  userId: string
}
