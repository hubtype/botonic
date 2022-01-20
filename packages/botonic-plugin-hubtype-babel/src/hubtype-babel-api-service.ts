import axios from 'axios'

export class HubtypeBabelApiService {
  private readonly HOST = 'https://api.hubtype.com'

  constructor(readonly projectId: string) {}

  async inference(text: string, accessToken: string) {
    return await axios({
      method: 'POST',
      url: `${this.HOST}/v1/babel/projects/${this.projectId}/inference/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: { text },
    })
  }
}
