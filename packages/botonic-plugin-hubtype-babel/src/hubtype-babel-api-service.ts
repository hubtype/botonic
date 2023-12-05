import axios, { AxiosResponse } from 'axios'

export class HubtypeBabelApiService {
  private readonly host: string
  constructor(readonly projectId: string) {
    this.host = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
  }

  async inference(
    text: string,
    accessToken: string,
    includeHasSense: boolean
  ): Promise<AxiosResponse> {
    return await axios({
      method: 'POST',
      url: `${this.host}/v1/babel/projects/${this.projectId}/inference/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: { text, include_has_sense: includeHasSense },
    })
  }
}
