import {
  Agent,
  type InputGuardrail,
  type ModelSettings,
  Runner,
  type UserMessageItem,
} from '@openai/agents'
import { z } from 'zod'
import { isProd } from '../constants'
import { getApiVersion, type LLMConfig } from '../llm-config'
import { HubtypeApiClient } from '../services/hubtype-api-client'
import { TrackFeature, TrackProductName } from '../services/types'
import type { GuardrailRule, ResultRawResponse } from '../types'

export interface GuardrailTrackingContext {
  botId: string
  isTest: boolean
  authToken: string
  inferenceId: string
}

export async function createInputGuardrails(
  rules: GuardrailRule[],
  llmConfig: LLMConfig,
  trackingContext: GuardrailTrackingContext
): Promise<InputGuardrail[]> {
  if (rules.length === 0) {
    return []
  }

  return [await buildInputGuardrail(rules, llmConfig, trackingContext)]
}

async function buildInputGuardrail(
  rules: GuardrailRule[],
  llmConfig: LLMConfig,
  trackingContext: GuardrailTrackingContext
): Promise<InputGuardrail> {
  const outputType = z.object(
    Object.fromEntries(
      rules.map(rule => [rule.name, z.boolean().describe(rule.description)])
    )
  )
  const modelSettings = createInputGuardrailModelSettings(llmConfig)

  const agent = new Agent({
    name: 'InputGuardrail',
    model: await llmConfig.getModel(),
    modelSettings,
    instructions:
      'Check if the user triggers some of the following guardrails.',
    outputType,
  })

  return {
    name: 'InputGuardrail',
    execute: async ({ input, context }) => {
      const lastMessage = input[input.length - 1] as UserMessageItem
      const runner = new Runner({
        tracingDisabled: true,
      })
      const startTime = Date.now()
      const result = await runner.run(agent, [lastMessage], { context })
      const endTime = Date.now()

      await sendGuardrailLlmRunTracking(
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

function createInputGuardrailModelSettings(
  llmConfig: LLMConfig
): ModelSettings {
  const modelSettings: ModelSettings = {
    ...llmConfig.modelSettings,
    toolChoice: undefined,
  }
  if (llmConfig.modelSettings.reasoning) {
    modelSettings.reasoning = { ...llmConfig.modelSettings.reasoning }
  }
  if (llmConfig.modelSettings.text) {
    modelSettings.text = { ...llmConfig.modelSettings.text }
  }
  return modelSettings
}

async function sendGuardrailLlmRunTracking(
  result: {
    rawResponses?: ResultRawResponse[]
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
  const apiVersion = getApiVersion()

  const llmRuns = rawResponses.map(response => ({
    inference_id: trackingContext.inferenceId,
    is_test: trackingContext.isTest,
    product_name: TrackProductName.AI_AGENT,
    deployment_name: llmConfig.modelName,
    model_name:
      (response.providerData?.model as string | undefined) ??
      llmConfig.modelName,
    feature: TrackFeature.AI_AGENT_GUARDRAIL,
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
