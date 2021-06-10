import axios, { AxiosResponse } from 'axios'

import { AccessToken } from './access-token'

export interface LanguageDetection {
  languageCode: string
  confidence: number
}

export interface Translation {
  translatedText: string
  detectedLanguageCode: string
}

type TranslateTextRequestData = {
  targetLanguageCode: string
  contents: string[]
  mimeType: string
}

type DetectLanguageRequestData = {
  content: string
}

export class GoogleTranslateApiService {
  private BASE_API_URL = 'https://translation.googleapis.com/v3'
  private PROJECTS_ENDPOINT = `${this.BASE_API_URL}/projects`
  private readonly translateTextEndpointUrl: string
  private readonly detectLanguageEndpointUrl: string

  constructor(private readonly accessToken: AccessToken, projectId: string) {
    const projectEndpointUrl = `${this.PROJECTS_ENDPOINT}/${projectId}`
    this.translateTextEndpointUrl = `${projectEndpointUrl}:translateText`
    this.detectLanguageEndpointUrl = `${projectEndpointUrl}:detectLanguage`
  }

  async translateText(text: string, target: string): Promise<Translation> {
    const data: TranslateTextRequestData = {
      targetLanguageCode: target,
      contents: [text],
      mimeType: 'text/plain',
    }
    try {
      const res = await this.query(this.translateTextEndpointUrl, data)
      return res.data.translations[0]
    } catch (e) {
      this.accessToken.refresh()
      const res = await this.query(this.translateTextEndpointUrl, data)
      return res.data.translations[0]
    }
  }

  async detectLanguage(text: string): Promise<LanguageDetection[]> {
    const data: DetectLanguageRequestData = {
      content: text,
    }
    try {
      const res = await this.query(this.detectLanguageEndpointUrl, data)
      return res.data.languages
    } catch (e) {
      this.accessToken.refresh()
      const res = await this.query(this.detectLanguageEndpointUrl, data)
      return res.data.languages
    }
  }

  private async query(
    url: string,
    data: TranslateTextRequestData | DetectLanguageRequestData
  ): Promise<AxiosResponse> {
    return await axios({
      method: 'post',
      url,
      headers: {
        Authorization: `Bearer ${this.accessToken.value}`,
        'Content-Type': 'application/json',
      },
      data,
    })
  }
}
