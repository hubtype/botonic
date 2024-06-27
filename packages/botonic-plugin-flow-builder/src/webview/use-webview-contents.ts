import axios from 'axios'
import { useEffect, useState } from 'react'

import { FLOW_BUILDER_API_URL_PROD } from '../constants'
import { FlowBuilderJSONVersion } from '../types'
import {
  UseWebviewContents,
  UseWebviewContentsProps,
  WebviewContentsResponse,
  WebviewContentType,
  WebviewImageContent,
  WebviewTextContent,
} from './types'

export function useWebviewContents({
  apiUrl = FLOW_BUILDER_API_URL_PROD,
  version = FlowBuilderJSONVersion.LATEST,
  orgId,
  botId,
  webviewId,
  locale,
  mapContents,
}: UseWebviewContentsProps): UseWebviewContents {
  const [textContents, setTextContents] = useState<WebviewTextContent[]>()
  const [imageContents, setImageContents] = useState<WebviewImageContent[]>()
  const [contents, setContents] = useState({})
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

  const createContentsObject = () => {
    const contentsObject = {}
    for (const [key, value] of Object.entries(mapContents)) {
      contentsObject[key] = getTextContent(value)
    }
    setContents(contentsObject)
  }

  useEffect(() => {
    const getResponseContents = async () => {
      const url = `${apiUrl}/webview/${version}`
      try {
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
        createContentsObject()
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
