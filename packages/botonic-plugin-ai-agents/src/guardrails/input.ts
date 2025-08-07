import { Agent, InputGuardrail, run } from '@openai/agents'
import { GuardrailFlag } from '../types'
import { z } from 'zod'

export function createInputGuardrail(flags: GuardrailFlag[]): InputGuardrail {
  const outputType = z.object(
    Object.fromEntries(
      flags.map(flag => [flag.name, z.boolean().describe(flag.description)])
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
      const result = await run(agent, input, { context })
      const finalOutput = result.finalOutput
      if (finalOutput === undefined) {
        throw new Error('Guardrail agent failed to produce output')
      }
      const triggered = Object.values(finalOutput).some(value => value === true)
      return {
        outputInfo: finalOutput,
        tripwireTriggered: triggered,
      }
    },
  }
}
