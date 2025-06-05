import { Agent, RunConfig, Runner, setDefaultOpenAIKey } from '@openai/agents'

import { OPENAI_API_KEY } from './constants'

async function main() {
  setDefaultOpenAIKey(OPENAI_API_KEY)
  const agent = new Agent({
    name: 'flight-status-agent',
    instructions: `You're an agent that only helps users to know the status of their flights.

Do not answer questions related to anything else apart from flight status. Instead use the exit_agent tool.

For this demo, act like all flights are delayed due to weather conditions. 

Apologize and use emojis to make the user feel more conformable.`,
    model: 'gpt-4.1-mini',
    tools: [],
  })
  const runConfig: Partial<RunConfig> = {
    model: 'gpt-4.1-mini',
    modelSettings: {
      temperature: 0.5,
    },
    tracingDisabled: true,
  }

  const runner = new Runner(runConfig)
  const response = await runner.run(agent, 'En que me puedes ayudar?')
  console.log(response)
}

main()
