import { execSync } from 'child_process'

export interface PulumiAuthenticator {
  doLogin(binary: string, args?: any): void
}

export class PulumiLocalAuthenticator implements PulumiAuthenticator {
  doLogin(binary: string): void {
    console.log('Logging in locally...')
    execSync(`${binary} login --local --non-interactive`)
  }
}

export class PulumiBucketAuthenticator implements PulumiAuthenticator {
  bucketName: string
  constructor(bucketName: string) {
    this.bucketName = bucketName
  }
  doLogin(binary: string): void {
    console.log(`Logging in bucket ${this.bucketName}...`)
    execSync(`${binary} login s3://${this.bucketName}`)
  }
}
