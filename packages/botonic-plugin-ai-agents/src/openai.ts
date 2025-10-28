import {
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from '@openai/agents'
import { AzureOpenAI } from 'openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_KEY,
  isProd,
} from './constants'

function configureOpenAIClient(client: AzureOpenAI) {
  setDefaultOpenAIClient(client)
  setOpenAIAPI('chat_completions')
  setTracingDisabled(true)
}

export function setAzureOpenAIClientGpt41() {
  const clientGpt41 = new AzureOpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    baseURL: AZURE_OPENAI_API_BASE,
    apiVersion: '2025-01-01-preview',
    deployment: 'gpt-41-mini_p1',
    dangerouslyAllowBrowser: !isProd,
  })
  configureOpenAIClient(clientGpt41)
}

export function setAzureOpenAIClientGpt5() {
  const clientGpt5 = new AzureOpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    baseURL: AZURE_OPENAI_API_BASE,
    apiVersion: '2025-04-01-preview', // '2025-01-01-preview',
    deployment: 'gpt-5-nano_p1', //'gpt-5-nano_p1',
    dangerouslyAllowBrowser: !isProd,
  })
  configureOpenAIClient(clientGpt5)
}
