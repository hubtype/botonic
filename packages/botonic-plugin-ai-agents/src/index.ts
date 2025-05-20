import { BotContext, Plugin } from '@botonic/core'

import { AiAgentClient } from './ai-agent-client'
import { AiAgentArgs, AiAgentResponse } from './types'

export default class BotonicPluginAiAgents implements Plugin {
  public aiAgentClient: AiAgentClient

  constructor() {
    this.aiAgentClient = new AiAgentClient()
  }

  pre(): void {
    return
  }

  async getInference(
    request: BotContext,
    aiAgentArgs: AiAgentArgs
  ): Promise<AiAgentResponse> {
    return this.aiAgentClient.getInference(request, aiAgentArgs)
  }
}
