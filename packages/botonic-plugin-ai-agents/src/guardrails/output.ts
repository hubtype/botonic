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
      'You are an output guardrail. Given a user question, retrieved knowledge, and a candidate assistant answer, decide whether the answer is supported by the knowledge and whether it should instead refuse due to insufficient knowledge. Work only with the provided inputs; do not bring in outside knowledge.',
    outputType,
  })

  return {
    name: 'OutputGuardrail',
    execute: async ({ agentOutput, context }) => {
      const outputMessages = JSON.stringify(agentOutput.messages)
      const userInput = (context as RunContext<Context>).context.request.input
        .data
      const knowledgeUsed = (context as RunContext<Context>).context
        .knowledgeUsed
      const chunkTexts = knowledgeUsed.chunkTexts

      agent.instructions += `
      The user's question is:
        <question>
          ${userInput}
        </question>

      To check for hallucinations, you have to use the following knowledge:
        <knowledge>
          ${chunkTexts?.join('\n')}
        </knowledge>
      `

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
