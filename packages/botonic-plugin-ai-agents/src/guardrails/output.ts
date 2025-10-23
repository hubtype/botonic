import { Agent, OutputGuardrail, run } from '@openai/agents'
import { z } from 'zod'

import { OutputSchema } from '../structured-output'
import { GuardrailRule } from '../types'

export function createOutputGuardrail(
  rules: GuardrailRule[]
): OutputGuardrail<typeof OutputSchema> {
  const outputType = z.object(
    Object.fromEntries(
      rules.map(rule => [rule.name, z.boolean().describe(rule.description)])
    )
  )

  const agent = new Agent({
    name: 'OutputGuardrail',
    instructions:
      'Check if the agent returns proper output according to the following guardrails.',
    outputType,
  })

  return {
    name: 'OutputGuardrail',
    execute: async ({ agentOutput, context }) => {
      const outputMessages = JSON.stringify(agentOutput.messages)
      console.log('outputMessages', outputMessages)
      const result = await run(agent, outputMessages, {
        context,
      })
      const finalOutput = result.finalOutput
      if (finalOutput === undefined) {
        throw new Error('Output guardrail, agent failed to produce output')
      }
      const triggered = Object.values(finalOutput).some(value => value === true)
      const triggeredOutputGuardrails = Object.keys(finalOutput).filter(
        key => finalOutput[key] === true
      )
      return {
        outputInfo: triggeredOutputGuardrails,
        tripwireTriggered: triggered,
      }
    },
  }
}
