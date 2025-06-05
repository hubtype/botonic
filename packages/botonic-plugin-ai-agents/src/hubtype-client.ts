import { BotContext } from '@botonic/core'

import { AgenticMessage } from './types'

export class HubtypeClient {
  constructor() {}

  async getMessages(
    _request: BotContext,
    _numMessages: number
  ): Promise<AgenticMessage[]> {
    // TODO: Implement an endpoint to get the messages from Hubtype
    const messages = []

    // TODO: Implement the logic to transform messages from Hubtype to OpenAI messages
    return messages
  }
}
