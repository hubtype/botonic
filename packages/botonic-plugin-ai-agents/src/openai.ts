import {
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from '@openai/agents'
import OpenAI, { AzureOpenAI } from 'openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  isProd,
  OPENAI_API_KEY,
  OPENAI_PROVIDER,
} from './constants'

export function setUpOpenAI(maxRetries?: number, timeout?: number) {
  if (OPENAI_PROVIDER === 'azure') {
    setAzureOpenAIClient(maxRetries, timeout)
  } else {
    setOpenAIClient(maxRetries, timeout)
  }
  setOpenAIAPI('responses')
  setTracingDisabled(true)
}

function setOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    timeout: timeout || 16000, // 16 seconds
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}

function setAzureOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new AzureOpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    apiVersion: AZURE_OPENAI_API_VERSION,
    deployment: AZURE_OPENAI_API_DEPLOYMENT_NAME,
    baseURL: AZURE_OPENAI_API_BASE,
    timeout: timeout || 16000, // 16 seconds
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}
