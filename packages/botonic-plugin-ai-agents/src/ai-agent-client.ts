/* eslint-disable @typescript-eslint/naming-convention */
import { BotContext, isDev } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import { AiAgentError } from './errors'
import {
  AiAgentArgs,
  AiAgentRequestData,
  AiAgentRequestDataTest,
  AiAgentResponse,
  Config,
} from './types'

export class AiAgentClient {
  private url: string

  constructor() {
    this.url = `${HUBTYPE_API_URL}/external/v1/ai/agent`
  }

  async getInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AiAgentResponse> {
    if (isDev(request.session)) {
      return this.agentTestInference(request, aiAgentArgs)
    }

    return this.agentInference(request, aiAgentArgs)
  }

  private async agentTestInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AiAgentResponse> {
    const config = this.getConfig(request)
    const data = this.getDataTest(request, aiAgentArgs)
    const response = await axios.post<AiAgentResponse>(
      `${this.url}/test/`,
      data,
      config
    )

    return response.data
  }

  private async agentInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AiAgentResponse> {
    const config = this.getConfig(request)
    const data = this.getData(request, aiAgentArgs)
    const response = await axios.post<AiAgentResponse>(
      `${this.url}/run/`,
      data,
      config
    )

    return response.data
  }

  private getConfig(request: BotContext): Config {
    return {
      headers: {
        Authorization: `Bearer ${request.session._access_token}`,
        'Content-Type': 'application/json',
      },
    }
  }

  private getData(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): AiAgentRequestData {
    if (!request.input.data) {
      throw new AiAgentError('No input data provided')
    }

    return {
      message: request.input.message_id,
      memory_length: 10,
      name: aiAgentArgs.name,
      instructions: aiAgentArgs.instructions,
    }
  }

  private getDataTest(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): AiAgentRequestDataTest {
    if (!request.input.data) {
      throw new AiAgentError('No input data provided')
    }

    // TODO: We can get messages from localStorage in Dev mode and transform them to the correct format {role: MessageRole, content: string}
    // if (isDev(request.session)) {
    //   const messages = localStorage.getItem('botonicState').
    // }

    return {
      messages: [
        {
          role: 'user',
          content: request.input.data,
        },
      ],
      name: aiAgentArgs.name,
      instructions: aiAgentArgs.instructions,
    }
  }
}
