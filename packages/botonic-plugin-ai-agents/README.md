# Botonic Plugin AI Agents

## env variables

- It is necessary to add the following variables to an `.env` file:
  - `AZURE_OPENAI_API_KEY`
  - `AZURE_OPENAI_API_BASE`
  - `AZURE_OPENAI_API_DEPLOYMENT_NAME`
  - `AZURE_OPENAI_API_VERSION`
- Add these env variables to build using rspack, for target NODE and DEV.

```ts
...
import { config } from 'dotenv'
config()
...
  const plugins = [
    new rspack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      HUBTYPE_API_URL: process.env.HUBTYPE_API_URL || HUBTYPE_DEFAULTS.API_URL,
      BOTONIC_TARGET: BotonicTarget.NODE,
      WEBCHAT_PUSHER_KEY:
        process.env.WEBCHAT_PUSHER_KEY || HUBTYPE_DEFAULTS.WEBCHAT_PUSHER_KEY,
      ENVIRONMENT: process.env.ENVIRONMENT,
      AZURE_OPENAI_API_KEY: isNodeOrDev
        ? process.env.AZURE_OPENAI_API_KEY
        : undefined,
      AZURE_OPENAI_API_DEPLOYMENT_NAME: isNodeOrDev
        ? process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
        : undefined,
      AZURE_OPENAI_API_VERSION: isNodeOrDev
        ? process.env.AZURE_OPENAI_API_VERSION
        : undefined,
      AZURE_OPENAI_API_BASE: isNodeOrDev
        ? process.env.AZURE_OPENAI_API_BASE
        : undefined,
    }),
    new rspack.ProgressPlugin(),
  ]
```

## Custom Tools

- It is possible to add tools from the bot code. To do this:
- Add the `zod` dependency.
- Create and export the definition of the tools in a file, for example: `src/server/tools.ts`.

```ts
import { CustomTool } from '@botonic/plugin-ai-agents'
import axios from 'axios'
import z from 'zod'

export const customTools: CustomTool[] = [
  {
    name: 'get_current_weather',
    description: 'Get current weather for a city',
    schema: z.object({
      cityName: z.string(),
    }),
    func: async (input: { cityName: string }) => {
      const baseURL = 'http://api.weatherapi.com/v1'
      const response = await axios.get(`${baseURL}/forecast.json`, {
        params: {
          key: 'WEATHER_API_TOKEN',
          q: input.cityName,
        },
      })
      const data = response.data
      console.log('get_current_weather', { data })
      return data
    },
  },
  ...
]
```

- Add these tools to:
- Update the `BotonicPluginFlowBuilderOptions`, as we did with the knowledge base, and add the `customTools`.

src/server/config.ts

```ts
import { PluginAiAgentOptions } from '@botonic/plugin-ai-agents'
import { customTools } from './tools'

...
function getFlowBuilderConfig(
  env: ENVIRONMENT
): BotonicPluginFlowBuilderOptions<BotPlugins, UserData> {
  return {
...
    getAiAgentResponse: async (
      request: BotRequest,
      aiAgentArgs: {
        name: string
        instructions: string
      }
    ) => {
      const aiAgentPlugin = request.plugins.aiAgents
      return await aiAgentPlugin.getInference(request, aiAgentArgs)
    },
...
}

function getAiAgentsConfig(): PluginAiAgentOptions {
  return {
    authToken: 'AUTH_TOKEN', // Used locally
    customTools: customTools,
  }
}
...

interface Config {
  // Use any for infer type for TPlugins and TExtraData
  // to avoid type errors with circular dependencies
  flowBuilder: BotonicPluginFlowBuilderOptions<any, any>
  aiAgents: PluginAiAgentOptions
  knowledgeBases: PluginKnowledgeBaseOptions
}

export const CONFIG: Record<ENVIRONMENT, Config> = {
  [ENVIRONMENT.LOCAL]: {
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.LOCAL),
    aiAgents: getAiAgentsConfig(),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
  ...
}
```

## Share customTools with flow builder frontend

- Create new `src/bot-config.ts` file and add customTools. This file is used so that every time a bot is deployed, the Flow Builder frontend can know which tools are in the deployed bot and enable or disable tools for each AI Agent node.

src/bot-config.ts

```ts
import { BotConfigJSON } from '@botonic/core'

import { customTools } from './server/tools'

const aiAgentTools =
  customTools?.map(customTool => ({
    name: customTool.name,
    description: customTool.description,
  })) || []

/**
 * This is the configuration is shared with flow-builder-frontend.
 */
export const botConfig: BotConfigJSON = {
  tools: aiAgentTools,
  payloads: [],
  webviews: [],
}
```
