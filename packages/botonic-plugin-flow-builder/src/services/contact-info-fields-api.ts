import axios from 'axios'

export class ContactInfoFieldsClient {
  constructor(
    private readonly hubtypeApiUrl: string,
    private readonly accessToken: string
  ) {}

  async update(
    chatId: string,
    fieldName: string,
    value: string | number | boolean
  ): Promise<void> {
    await axios.put(
      `${this.hubtypeApiUrl}/external/v1/chats/${chatId}/contact_info_fields/${encodeURIComponent(fieldName)}/`,
      { value },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
  }

  async delete(chatId: string, fieldName: string): Promise<void> {
    await axios.delete(
      `${this.hubtypeApiUrl}/external/v1/chats/${chatId}/contact_info_fields/${encodeURIComponent(fieldName)}/`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
  }
}
