import {
  type BotContext,
  EventAction,
  type EventCaptureUserInput,
} from '@botonic/core'
import type { FlowBuilderApi } from '../api'
import { FlowCaptureUserInput } from '../content-fields'
import {
  HtAiValidationType,
  type HtCaptureUserInputNode,
} from '../content-fields/hubtype-fields'
import { CaptureUserInputClient } from '../services/capture-user-input-client'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { inputHasTextOrTranscript } from '../utils/input'

export class CaptureUserInputResolver {
  private cmsApi: FlowBuilderApi
  private botContext: BotContext
  private textOrTranscript: string
  private captureUserInputClient: CaptureUserInputClient

  constructor(
    cmsApi: FlowBuilderApi,
    botContext: BotContext,
    textOrTranscript: string
  ) {
    this.cmsApi = cmsApi
    this.botContext = botContext
    this.textOrTranscript = textOrTranscript
    this.captureUserInputClient = new CaptureUserInputClient(botContext)
  }

  async getNextNodeId(): Promise<string | undefined> {
    if (
      inputHasTextOrTranscript(this.botContext.input) &&
      this.cmsApi.shouldCaptureUserInput()
    ) {
      const captureUserInputNode = this.cmsApi.getCaptureUserInputNode()
      if (!captureUserInputNode || !this.textOrTranscript) {
        return undefined
      }
      const captureUserInput =
        FlowCaptureUserInput.fromHubtypeCMS(captureUserInputNode)

      if (captureUserInput.aiValidationType === HtAiValidationType.NONE) {
        this.cmsApi.setUserExtraDataVariable(
          captureUserInputNode.content.field_name,
          this.textOrTranscript
        )
        await this.trackUserInputCapture(captureUserInputNode, true)
        return captureUserInput.captureSuccessId
      }

      const aiCaptureResponse =
        await this.captureUserInputClient.getAiCaptureResponse(
          this.textOrTranscript,
          captureUserInputNode.content.field_name,
          captureUserInputNode.content.ai_validation_instructions
        )
      if (!aiCaptureResponse.success) {
        await this.trackUserInputCapture(captureUserInputNode, false)
        return captureUserInput.captureFailId
      }

      this.cmsApi.setUserExtraDataVariable(
        captureUserInputNode.content.field_name,
        aiCaptureResponse.value
      )
      await this.trackUserInputCapture(captureUserInputNode, true)
      return captureUserInput.captureSuccessId
    }
    return undefined
  }

  async trackUserInputCapture(
    captureUserInputNode: HtCaptureUserInputNode,
    captureSuccess: boolean
  ): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(
        this.botContext,
        captureUserInputNode.id
      )
    const event: EventCaptureUserInput = {
      action: EventAction.CaptureUserInput,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      fieldName: captureUserInputNode.content.field_name,
      userInput: this.textOrTranscript,
      captureSuccess,
      messageId: this.botContext.input.message_id,
    }
    const { action, ...eventArgs } = event
    await trackEvent(this.botContext, action, eventArgs)
  }
}
