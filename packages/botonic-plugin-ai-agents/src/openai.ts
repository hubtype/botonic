import {
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from '@openai/agents'
import { AzureOpenAI } from 'openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  isProd,
} from './constants'

export function setUpOpenAI(maxRetries?: number, timeout?: number) {
  setAzureOpenAIClient(maxRetries, timeout)
  setOpenAIAPI('chat_completions')
  setTracingDisabled(true)
}

function setAzureOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new AzureOpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    apiVersion: AZURE_OPENAI_API_VERSION,
    deployment: AZURE_OPENAI_API_DEPLOYMENT_NAME,
    baseURL: AZURE_OPENAI_API_BASE,
    timeout: timeout || 8000, // 8 seconds
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}
