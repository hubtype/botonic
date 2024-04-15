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
  locale,
}: UseWebviewContentsProps): UseWebviewContents {
  const [textContents, setTextContents] = useState<WebviewTextContent[]>()
  const [imageContents, setImageContents] = useState<WebviewImageContent[]>()
  const [currentLocale, setCurrentLocale] = useState(locale)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const getResponseContents = async () => {
      setLoading(true)
      const url = `${flowBuilderApiUrl}/webview/${version}`
      const response = await axios.get<WebviewContentsResponse>(url, {
        params: { org: orgId, bot: botId, webview: webviewId },
      })

      const textResponseContents = response.data.webview_contents.filter(
        webviewContent => webviewContent.type === WebviewContentType.TEXT
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

  const getTextContent = (contentID: string): string | undefined => {
    return textContents
      ?.find(textContent => textContent.code === contentID)
      ?.content.text.find(text => text.locale === currentLocale)?.message
  }

  const getImageSrc = (contentID: string): string | undefined => {
    return imageContents
      ?.find(imageContent => imageContent.code === contentID)
      ?.content.image.find(image => image.locale === currentLocale)?.file
  }

  return {
    isLoading,
    webviewContext: {
      getTextContent,
      getImageSrc,
      setCurrentLocale,
    },
  }
}
