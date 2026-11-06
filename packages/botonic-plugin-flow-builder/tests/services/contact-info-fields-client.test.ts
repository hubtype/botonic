import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import axios from 'axios'

import { ContactInfoFieldsClient } from '../../src/services/contact-info-fields-client'
import { createServiceClientBotContext } from '../helpers/service-client-test-context'

jest.mock('axios')
const axiosPutMock = axios.put as jest.MockedFunction<typeof axios.put>
const axiosDeleteMock = axios.delete as jest.MockedFunction<typeof axios.delete>

describe('ContactInfoFieldsClient', () => {
  const hubtypeApi = 'https://api.test.hubtype.com'
  const chatId = 'chat-uuid-1'

  beforeEach(() => {
    axiosPutMock.mockReset()
    axiosDeleteMock.mockReset()
    axiosPutMock.mockResolvedValue(undefined)
    axiosDeleteMock.mockResolvedValue(undefined)
  })

  test('update puts encoded field path and JSON body', async () => {
    const fieldName = 'name & co'
    const encoded = encodeURIComponent(fieldName)
    const client = new ContactInfoFieldsClient(
      createServiceClientBotContext({
        hubtypeApi,
        userId: chatId,
      })
    )

    await client.update(fieldName, 'Alice')

    expect(axiosPutMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v1/chats/${chatId}/contact_info_fields/${encoded}/`,
      { value: 'Alice' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-access-token',
        },
      }
    )
  })

  test('delete requests encoded field path with Authorization only', async () => {
    const fieldName = 'a field'
    const encoded = encodeURIComponent(fieldName)
    const client = new ContactInfoFieldsClient(
      createServiceClientBotContext({
        hubtypeApi,
        userId: chatId,
      })
    )

    await client.delete(fieldName)

    expect(axiosDeleteMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v1/chats/${chatId}/contact_info_fields/${encoded}/`,
      {
        headers: {
          Authorization: 'Bearer test-access-token',
        },
      }
    )
  })
})
