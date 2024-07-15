import axios from 'axios'
import { useEffect, useState } from 'react'

import { FLOW_BUILDER_API_URL_PROD } from '../constants'
import { FlowBuilderJSONVersion } from '../types'
import {
  MapContentsType,
  UseWebviewContents,
  UseWebviewContentsProps,
  WebviewContentsResponse,
  WebviewContentType,
  WebviewImageContent,
  WebviewTextContent,
} from './types'

export function useWebviewContents<T extends MapContentsType>({
  apiUrl = FLOW_BUILDER_API_URL_PROD,
  version = FlowBuilderJSONVersion.LATEST,
  orgId,
  botId,
  webviewId,
  locale,
  mapContents,
}: UseWebviewContentsProps<T>): UseWebviewContents<T> {
  const [textContents, setTextContents] = useState<WebviewTextContent[]>()
  const [imageContents, setImageContents] = useState<WebviewImageContent[]>()
  const [contents, setContents] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  )
  const [currentLocale, setCurrentLocale] = useState(locale)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const getTextContent = (contentID: string): string => {
    return (
      textContents
        ?.find(textContent => textContent.code === contentID)
        ?.content.text.find(text => text.locale === currentLocale)?.message ||
      ''
    )
  }

  const getImageSrc = (contentID: string): string => {
    return (
      imageContents
        ?.find(imageContent => imageContent.code === contentID)
        ?.content.image.find(image => image.locale === currentLocale)?.file ||
      ''
    )
  }

  useEffect(() => {
    if (textContents || imageContents) {
      const contentsObject = {}
      for (const [key, value] of Object.entries<string>(mapContents)) {
        contentsObject[key] = getTextContent(value) || getImageSrc(value)
      }
      setContents(contentsObject as Record<keyof T, string>)
    }
  }, [textContents, imageContents, currentLocale])

  useEffect(() => {
    const getResponseContents = async () => {
      const url = `${apiUrl}/webview/${version}`
      try {
        const response = await axios.get<WebviewContentsResponse>(url, {
          params: { org: orgId, bot: botId, webview: webviewId },
        })

        const textResponseContents = response.data.webview_contents.filter(
          webviewContent => webviewContent.type === WebviewContentType.TEXT
        )
        setTextContents(textResponseContents)

        const imageResponseContents = response.data.webview_contents.filter(
          webviewContent => webviewContent.type === WebviewContentType.IMAGE
        )
        setImageContents(imageResponseContents)
      } catch (error) {
        console.error('Error fetching webview contents:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    getResponseContents()
  }, [])

  return {
    isLoading,
    error,
    webviewContentsContext: {
      getTextContent,
      getImageSrc,
      setCurrentLocale,
      contents,
    },
  }
}
