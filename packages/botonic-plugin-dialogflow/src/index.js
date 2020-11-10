import axios from 'axios'
import { KJUR } from 'jsrsasign'
import { v4 as uuidv4 } from 'uuid'

export default class BotonicPluginDialogflow {
  constructor(creds) {
    this.projectID = creds.project_id
    this.sessionID = uuidv4()
    this.creds = creds
    this.token = null
  }

  async getToken() {
    if (!this.token) {
      this.token = await this.generateToken(this.creds)
    }
    return this.token
  }

  async pre({ input, session, lastRoutePath }) {
    try {
      await this.dialogflowToInput({ input, session, lastRoutePath })
    } catch (error) {
      console.log(error.response)
      await this.refreshToken()
      await this.dialogflowToInput({ input, session, lastRoutePath })
    }
    return { input, session, lastRoutePath }
  }

  async post({ input, session, lastRoutePath, response }) {}

  async refreshToken() {
    this.token = await this.generateToken(this.creds)
  }

  async generateToken(creds) {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: creds.private_key_id,
    }
    const payload = {
      iss: creds.client_email,
      sub: creds.client_email,
      iat: KJUR.jws.IntDate.get('now'),
      exp: KJUR.jws.IntDate.get('now + 1hour'),
      aud:
        'https://dialogflow.googleapis.com/google.cloud.dialogflow.v2.Sessions',
    }

    const stringHeader = JSON.stringify(header)
    const stringPayload = JSON.stringify(payload)
    const token = KJUR.jws.JWS.sign(
      'RS256',
      stringHeader,
      stringPayload,
      creds.private_key
    )
    return token
  }

  async query(queryData, languageCode = 'en-US') {
    return axios({
      method: 'post',
      url: `https://dialogflow.googleapis.com/v2/projects/${this.projectID}/agent/sessions/${this.sessionID}:detectIntent`,
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
        'Content-Type': 'application/json',
      },
      data: {
        queryInput: {
          text: {
            text: queryData,
            languageCode: languageCode,
          },
        },
      },
    })
  }

  async dialogflowToInput({ input, session, lastRoutePath }) {
    let confidence = 0
    let intent = null
    const intents = []
    let entities = []
    let defaultFallback = ''
    let dialogflowResponse = null

    const queryData = input.data || input.payload || null
    dialogflowResponse = await this.query(queryData)

    const queryResult = dialogflowResponse.data.queryResult
    intent = queryResult.intent.displayName
    confidence = queryResult.intentDetectionConfidence
    entities = queryResult.parameters
    defaultFallback = queryResult.fulfillmentText
    dialogflowResponse = dialogflowResponse.data

    Object.assign(input, {
      intent,
      confidence,
      intents,
      entities,
      defaultFallback,
      dialogflowResponse,
    })
    return { input, session, lastRoutePath }
  }
}
