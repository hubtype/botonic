import { getBotonicApp } from '@botonic/react'
import axios from 'axios'

export async function downloadTranscript(): Promise<void> {
  const content = await getTranscript()
  const fileName = 'chat_transcript.pdf'
  const windowUrl = window.URL
  const url = windowUrl.createObjectURL(content)
  const anchor = document.createElement('a')
  anchor.setAttribute('href', url)
  anchor.setAttribute('download', fileName)
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  windowUrl.revokeObjectURL(url)
}

async function getTranscript(): Promise<Blob> {
  const app = getBotonicApp()
  try {
    // @ts-ignore
    const providerAccount = app.appId
    // @ts-ignore
    const providerId = app.hubtypeService?.user.id

    const endpointUrl = `https://api.hubtype.com/v1/chats/transcript/`
    const resp = await axios({
      headers: {
        'X-BOTONIC-USER-ID': providerId,
      },
      method: 'get',
      responseType: 'blob',
      url: endpointUrl,
      params: {
        provider_account: providerAccount,
        provider_id: providerId,
      },
    })
    return resp.data
  } catch (e: any) {
    throw new Error(`Error getting transcript ${e.message as string}`)
  }
}
