import type { BotContext, ResolvedPlugins } from '@botonic/core'
import axios from 'axios'

import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

interface LanguageDetectionResponse {
  detected_language: string | null
  confidence: number
}

type LanguageDetectionApiRequest<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
> = Pick<BotContext<TPlugins>, 'plugins' | 'session'>

export class LanguageDetectionApi {
  constructor(private readonly request: LanguageDetectionApiRequest) {}

  async detectAndStoreLanguage(text?: string): Promise<void> {
    if (!text || this.request.session.user.language_detected) {
      return
    }

    const detectedLanguage = await this.detectLanguage(text)

    if (
      detectedLanguage?.detected_language &&
      detectedLanguage.confidence > 0.7
    ) {
      this.request.session.user.locale = detectedLanguage.detected_language
      this.request.session.user.language_detected = true
    }
  }

  async detectLanguage(text: string): Promise<LanguageDetectionResponse | null> {
    try {
      if (!process.env.HUBTYPE_API_URL) {
        throw new Error('HUBTYPE_API_URL is not defined')
      }

      const url = `${process.env.HUBTYPE_API_URL}/external/v1/language_detection/`
      const pluginFlowBuilder = getFlowBuilderPlugin(this.request.plugins)
      const token = pluginFlowBuilder.getAccessToken(this.request.session)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.post<LanguageDetectionResponse>(
        url,
        { text },
        config
      )

      return response.data
    } catch (error) {
      console.warn('Error detecting user language', error)
      return null
    }
  }
}
