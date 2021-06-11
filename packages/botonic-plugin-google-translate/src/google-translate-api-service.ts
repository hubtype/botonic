import axios, { AxiosResponse } from 'axios'

import { AccessToken } from './access-token'

export interface LanguageDetection {
  languageCode: string
  confidence: number
}

export class GoogleTranslateApiService {
  constructor(
    private readonly accessToken: AccessToken,
    private readonly projectId: string
  ) {}

  async detectLanguage(text: string): Promise<LanguageDetection[]> {
    try {
      const res = await this.detectLanguageQuery(text)
      return res.data.languages
    } catch (e) {
      this.accessToken.refresh()
      const res = await this.detectLanguageQuery(text)
      return res.data.languages
    }
  }

  private async detectLanguageQuery(text: string): Promise<AxiosResponse> {
    return await axios({
      method: 'post',
      url: `https://translation.googleapis.com/v3/projects/${this.projectId}/locations/global:detectLanguage`,
      headers: {
        Authorization: `Bearer ${this.accessToken.value}`,
        'Content-Type': 'application/json',
      },
      data: {
        content: text,
      },
    })
  }
}
