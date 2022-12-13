import axios, { AxiosResponse } from 'axios'

export class HubtypeBabelApiService {
  constructor(
    readonly projectId: string,
    readonly host: string = 'https://api.hubtype.com'
  ) {}

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
