import { AzureChatOpenAI } from '@langchain/openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
} from './constants'

export function loadChatModel(provider: 'azureOpenAI') {
  switch (provider) {
    case 'azureOpenAI':
      return new AzureChatOpenAI({
        azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
        azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
        azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIEndpoint: AZURE_OPENAI_API_BASE,
        temperature: 0,
        // other params...
      })
    default:
      throw new Error(`Provider ${provider} not supported`)
  }
}
