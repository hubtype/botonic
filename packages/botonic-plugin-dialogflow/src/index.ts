import type { Plugin, PluginPreRequest } from '@botonic/core'
import axios, { AxiosResponse } from 'axios'
import jsrsasign from 'jsrsasign'
import { v7 as uuidv7 } from 'uuid'

import { Credentials, Options } from './types'

export default class BotonicPluginDialogflow implements Plugin {
  sessionId: string
  creds: Credentials
  token: string
  defaultQueryData: Options['queryData']
  constructor(options: Options) {
    const { credentials, queryData } = options
    this.sessionId = uuidv7()
    this.creds = credentials
    this.defaultQueryData = queryData || {}
  }

  async getToken(): Promise<string> {
    if (this.token == null) {
      this.token = await this.generateToken(this.creds)
    }
    return this.token
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      await this.dialogflowToInput(request)
    } catch (error) {
      await this.refreshToken()
      await this.dialogflowToInput(request)
    }
    return
  }

  async refreshToken(): Promise<void> {
    this.token = await this.generateToken(this.creds)
  }

  async generateToken(creds: Credentials): Promise<string> {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: creds.private_key_id,
    }
    const payload = {
      iss: creds.client_email,
      sub: creds.client_email,
      iat: jsrsasign.KJUR.jws.IntDate.get('now'),
      exp: jsrsasign.KJUR.jws.IntDate.get('now + 1hour'),
      aud: 'https://dialogflow.googleapis.com/google.cloud.dialogflow.v2.Sessions',
    }
    const stringHeader = JSON.stringify(header)
    const stringPayload = JSON.stringify(payload)
    const token = jsrsasign.KJUR.jws.JWS.sign(
      'RS256',
      stringHeader,
      stringPayload,
      creds.private_key
    )
    return token
  }

  async query(
    queryData: string,
    languageCode = 'en-US'
  ): Promise<AxiosResponse> {
    return axios({
      method: 'post',
      url: `https://dialogflow.googleapis.com/v2/projects/${this.creds.project_id}/agent/sessions/${this.sessionId}:detectIntent`,
      headers: {
        /* eslint-disable @typescript-eslint/naming-convention */
        Authorization: `Bearer ${await this.getToken()}`,
        'Content-Type': 'application/json',
      },
      data: {
        ...this.defaultQueryData,
        queryInput: {
          ...this.defaultQueryData?.queryInput,
          text: {
            text: queryData,
            languageCode: languageCode,
          },
        },
      },
    })
  }

  async dialogflowToInput(request: PluginPreRequest): Promise<void> {
    let confidence = 0
    let intent = null
    const intents = []
    let entities = []
    let defaultFallback = ''
    let dialogflowResponse: AxiosResponse

    const queryData = request.input.data || request.input.payload || ''
    dialogflowResponse = await this.query(queryData)
    const queryResult = dialogflowResponse.data.queryResult
    intent = queryResult.intent.displayName
    confidence = queryResult.intentDetectionConfidence
    entities = queryResult.parameters
    defaultFallback = queryResult.fulfillmentText
    dialogflowResponse = dialogflowResponse.data

    Object.assign(request.input, {
      intent,
      confidence,
      intents,
      entities,
      defaultFallback,
      dialogflowResponse,
    })
    return
  }
}
