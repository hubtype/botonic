import axios from 'axios'
import { useEffect, useState } from 'react'

import {
  UseWebviewContents,
  UseWebviewContentsProps,
  WebviewContentsResponse,
  WebviewContentType,
  WebviewImageContent,
  WebviewTextContent,
} from './types'

export function useWebviewContents({
  flowBuilderApiUrl,
  version,
  orgId,
  botId,
  webviewId,
}: UseWebviewContentsProps): UseWebviewContents {
  const [textContents, setTextContents] = useState<WebviewTextContent[]>()
  const [imageContents, setImageContents] = useState<WebviewImageContent[]>()
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const getResponseContents = async () => {
      setLoading(true)
      const url = `${flowBuilderApiUrl}/webview/${version}`
      const response = await axios.get<WebviewContentsResponse>(url, {
        params: { org: orgId, bot: botId, webview: webviewId },
      })

      const textResponseContents = response.data.webview_contents.filter(
        webviewContent =>
          webviewContent.type === WebviewContentType.TEXT &&
          'text' in webviewContent.content
      ) as WebviewTextContent[]
      setTextContents(textResponseContents)

      const imageResponseContents = response.data.webview_contents.filter(
        webviewContent => webviewContent.type === WebviewContentType.IMAGE
      ) as WebviewImageContent[]
      setImageContents(imageResponseContents)

      setLoading(false)
    }
    getResponseContents()
  }, [])

  const getTextContent = (contentID: string, locale: string) => {
    return textContents
      ?.find(textContent => textContent.code === contentID)
      ?.content.text.find(text => text.locale === locale)?.message
  }

  const getImageSrc = (contentID: string, locale: string) => {
    return imageContents
      ?.find(imageContent => imageContent.code === contentID)
      ?.content.image.find(image => image.locale === locale)?.file
  }

  return {
    isLoading,
    webviewContext: {
      getTextContent,
      getImageSrc,
      textContents: textContents || [],
      imageContents: imageContents || [],
    },
  }
}
