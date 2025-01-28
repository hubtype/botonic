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
  // @ts-ignore
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
  const [error, setError] = useState(false)

  const updateCurrentLocale = (textContents?: WebviewTextContent[]) => {
    if (!textContents || textContents.length === 0) {
      console.log('There is no text contents to check the locale')
      return
    }

    const locales = textContents[0].content.text.map(text => text.locale)
    const language = currentLocale.split('-')[0]

    if (locales.includes(currentLocale)) {
      setCurrentLocale(currentLocale)
      return
    }

    if (locales.includes(language)) {
      setCurrentLocale(language)
      return
    }

    console.error(
      `locale: ${currentLocale} cannot be resolved with: ${locales.join(', ')}`
    )
  }

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
      const url = `${apiUrl}/v1/bot_flows/${botId}/versions/${version}/webviews/${webviewId}/`
      try {
        const response = await axios.get<WebviewContentsResponse>(url)

        const textResponseContents = response.data.filter(
          webviewContent => webviewContent.type === WebviewContentType.TEXT
        ) as WebviewTextContent[]
        setTextContents(textResponseContents)

        const imageResponseContents = response.data.filter(
          webviewContent => webviewContent.type === WebviewContentType.IMAGE
        ) as WebviewImageContent[]
        setImageContents(imageResponseContents)

        updateCurrentLocale(textResponseContents)
      } catch (error) {
        console.error('Error fetching webview contents:', error)
        setError(true)
      }
    }
    getResponseContents()
  }, [])

  return {
    isLoading: Object.keys(contents).length === 0,
    error,
    webviewContentsContext: {
      getTextContent,
      getImageSrc,
      setCurrentLocale,
      contents,
    },
  }
}
