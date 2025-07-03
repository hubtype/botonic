import { AzureChatOpenAI } from '@langchain/openai'
import { TOOLS } from './tools'

const AZURE_OPENAI_API_VERSION = '2025-04-01-preview'
const AZURE_OPENAI_API_KEY = '0d0f4cdaa9244f419a3023f4eba4399e'
const AZURE_OPENAI_API_DEPLOYMENT_NAME = 'gpt-41-mini_beta'
const AZURE_OPENAI_API_BASE =
  'https://ht-dev-dev-euw1-sc-openai.openai.azure.com/'

export const llm = new AzureChatOpenAI({
  azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
  azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
  azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIEndpoint: AZURE_OPENAI_API_BASE,
  temperature: 0,
})

// export const llmWithTools =
//   llm.bindTools?.(TOOLS, {
//     tool_choice: 'any',
//   }) || llm
