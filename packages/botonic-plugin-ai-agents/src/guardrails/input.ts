import {
  Agent,
  type InputGuardrail,
  Runner,
  type UserMessageItem,
} from '@openai/agents'
import { z } from 'zod'
import type { LLMConfig } from '../llm-config'
import type { GuardrailRule } from '../types'

export function createInputGuardrail(
  rules: GuardrailRule[],
  llmConfig: LLMConfig
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
      const result = await runner.run(agent, [lastMessage], { context })

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
