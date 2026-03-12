import {
  Agent,
  type InputGuardrail,
  Runner,
  type UserMessageItem,
} from '@openai/agents'
import { z } from 'zod'
import { AZURE_OPENAI_API_VERSION, isProd, OPENAI_PROVIDER } from '../constants'
import type { LLMConfig } from '../llm-config'
import { HubtypeApiClient } from '../services/hubtype-api-client'
import type { GuardrailRule } from '../types'

export interface GuardrailTrackingContext {
  botId: string
  isTest: boolean
  authToken: string
  inferenceId: string
}

export function createInputGuardrail(
  rules: GuardrailRule[],
  llmConfig: LLMConfig,
  trackingContext: GuardrailTrackingContext
): InputGuardrail {
  const outputType = z.object(
    Object.fromEntries(
      rules.map(rule => [rule.name, z.boolean().describe(rule.description)])
    )
  )

  const agent = new Agent({
    name: 'InputGuardrail',
    instructions:
      'Check if the user triggers some of the following guardrails.',
    outputType,
  })

  return {
    name: 'InputGuardrail',
    execute: async ({ input, context }) => {
      const lastMessage = input[input.length - 1] as UserMessageItem
      const runner = new Runner({
        modelSettings: llmConfig.modelSettings,
        modelProvider: llmConfig.modelProvider,
        tracingDisabled: true,
      })
      const startTime = Date.now()
      const result = await runner.run(agent, [lastMessage], { context })
      const endTime = Date.now()

      void sendGuardrailLlmRunTracking(
        result,
        trackingContext,
        llmConfig,
        startTime,
        endTime
      )

      const finalOutput = result.finalOutput as Record<string, boolean>
      if (finalOutput === undefined) {
        throw new Error('Guardrail agent failed to produce output')
      }
      const triggered = Object.values(finalOutput).some(value => value === true)
      const triggeredGuardrails = Object.keys(finalOutput).filter(
        key => finalOutput[key] === true
      )
      return {
        outputInfo: triggeredGuardrails,
        tripwireTriggered: triggered,
      }
    },
  }
}

async function sendGuardrailLlmRunTracking(
  result: {
    rawResponses?: Array<{
      usage: { inputTokens: number; outputTokens: number }
      providerData?: Record<string, unknown>
    }>
  },
  trackingContext: GuardrailTrackingContext,
  llmConfig: LLMConfig,
  startTime: number,
  endTime: number
): Promise<void> {
  if (!isProd) {
    return
  }
  const rawResponses = result.rawResponses ?? []
  if (rawResponses.length === 0) {
    return
  }
  const totalDuration = endTime - startTime
  const durationPerCall = Math.round(totalDuration / rawResponses.length)
  const temperature =
    (llmConfig.modelSettings.temperature as number | undefined) ?? 0
  const apiVersion = OPENAI_PROVIDER === 'azure' ? AZURE_OPENAI_API_VERSION : ''

  const llmRuns = rawResponses.map(response => ({
    inference_id: trackingContext.inferenceId,
    is_test: trackingContext.isTest,
    deployment_name: llmConfig.modelName,
    model_name:
      (response.providerData?.['model'] as string | undefined) ??
      llmConfig.modelName,
    feature: 'ai_agent_guardrail',
    api_version: apiVersion,
    num_prompt_tokens: response.usage.inputTokens,
    num_completion_tokens: response.usage.outputTokens,
    duration_in_milliseconds: durationPerCall,
    temperature,
    error: null,
  }))

  const client = new HubtypeApiClient(trackingContext.authToken)
  await client.trackLlmRuns(trackingContext.botId, {
    llm_runs: llmRuns,
  })
}
