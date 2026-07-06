import { setDefaultOpenAIClient, setTraceProcessors } from '@openai/agents'
import { Client } from 'langsmith'
import { OpenAIAgentsTracingProcessor } from 'langsmith/wrappers/openai_agents'
import type OpenAI from 'openai'
import type { AzureOpenAI } from 'openai'
import {
  LANGSMITH_API_KEY,
  LANGSMITH_ENDPOINT,
  LANGSMITH_WORKSPACE_ID,
} from './constants'

export function setTraceProcessor(litellmClient: OpenAI | AzureOpenAI) {
  setDefaultOpenAIClient(litellmClient)

  const langsmithClient = new Client({
    apiKey: LANGSMITH_API_KEY,
    apiUrl: LANGSMITH_ENDPOINT,
    workspaceId: LANGSMITH_WORKSPACE_ID,
  })

  const langsmithProcessor = new OpenAIAgentsTracingProcessor({
    client: langsmithClient,
    projectName: 'ai-agents-bots',
    name: 'AI Agents workflow',
    tags: ['openai-agents', 'litellm'],
    metadata: {
      environment: process.env.NODE_ENV ?? 'development',
      gateway: 'litellm',
    },
  })

  setTraceProcessors([langsmithProcessor])
}
