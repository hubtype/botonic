import { Agent, OutputGuardrail, run, RunContext } from '@openai/agents'
import { z } from 'zod'

import { OutputSchema } from '../structured-output'
import { Context, GuardrailRule } from '../types'

export function createOutputGuardrail(
  rules: GuardrailRule[]
): OutputGuardrail<typeof OutputSchema> {
  const outputType = z.object(
    Object.fromEntries(
      rules.map(rule => [rule.name, z.boolean().describe(rule.description)])
    )
  )

  const agent = new Agent({
    name: 'Knowledge OutputGuardrail',
    instructions:
      'You are a guardrail agent. You must check if the output messages comply with the following knowledge:',
    outputType,
  })

  return {
    name: 'OutputGuardrail',
    execute: async ({ agentOutput, context }) => {
      console.log('OutputGuardrail', { agentOutput, context })
      const outputMessages = JSON.stringify(agentOutput.messages)
      console.log('outputMessages', outputMessages)
      const knowledgeUsed = (context as RunContext<Context>).context
        .knowledgeUsed
      const chunkTexts = knowledgeUsed.chunkTexts
      console.log('knowledgeUsed', knowledgeUsed)

      agent.instructions += `
        <knowledge>
          ${chunkTexts?.join('\n')}
        </knowledge>
      `

      console.log('agent', agent.instructions)

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
