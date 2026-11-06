import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HubtypeClientBase } from './hubtype-client-base'

export class ContactInfoFieldsClient extends HubtypeClientBase {
  private chatId: string

  constructor(botContext: BotContext) {
    super(botContext)
    this.chatId = botContext.session.user.id
  }

  async update(
    fieldName: string,
    value: string | number | boolean
  ): Promise<void> {
    await axios.put(
      `${this.hubtypeApiUrl}/external/v1/chats/${this.chatId}/contact_info_fields/${encodeURIComponent(fieldName)}/`,
      { value },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
  }

  async delete(fieldName: string): Promise<void> {
    await axios.delete(
      `${this.hubtypeApiUrl}/external/v1/chats/${this.chatId}/contact_info_fields/${encodeURIComponent(fieldName)}/`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
  }
}
