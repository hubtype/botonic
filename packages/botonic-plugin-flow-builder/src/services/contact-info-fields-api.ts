import type { BotContext } from '@botonic/core'
import axios from 'axios'
import { HUBTYPE_API_URL } from '../constants'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

export class ContactInfoFieldsClient {
  private hubtypeApiUrl: string
  private accessToken: string
  private chatId: string

  constructor(botContext: BotContext) {
    this.hubtypeApiUrl = botContext.settings?.HUBTYPE_API_URL || HUBTYPE_API_URL
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    this.accessToken = flowBuilderPlugin.getAccessToken(botContext.session)
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
