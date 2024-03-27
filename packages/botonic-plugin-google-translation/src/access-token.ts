import jsrsasign from 'jsrsasign'

import { Credentials } from './options'

export class AccessToken {
  value: string
  private readonly header: string
  private readonly payload: string

  constructor(private readonly credentials: Credentials) {
    this.header = JSON.stringify({
      alg: 'RS256',
      typ: 'JWT',
      kid: credentials.privateKeyId,
    })
    this.payload = JSON.stringify({
      iss: credentials.clientEmail,
      sub: credentials.clientEmail,
      iat: jsrsasign.KJUR.jws.IntDate.get('now'),
      exp: jsrsasign.KJUR.jws.IntDate.get('now + 1hour'),
      aud: 'https://translation.googleapis.com/',
    })
    this.value = this.generate()
  }

  refresh(): void {
    this.value = this.generate()
  }

  private generate(): string {
    return jsrsasign.KJUR.jws.JWS.sign(
      'RS256',
      this.header,
      this.payload,
      this.credentials.privateKey
    )
  }
}
