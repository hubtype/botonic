import { join } from 'path'

import {
  BOT_CREDS_FILENAME,
  BOTONIC_HOME_DIR,
  BOTONIC_PROJECT_PATH,
  GLOBAL_CREDS_FILENAME,
} from '../constants'
import {
  BotCredentials,
  CredentialsHandlerArgs,
  GlobalCredentials,
} from '../interfaces'
import { create, pathExists, readJSON, writeJSON } from '../util/file-system'

export class CredentialsHandler {
  homePath: string
  pathToCredentials: string

  constructor(args: CredentialsHandlerArgs) {
    this.homePath = args.homePath
    this.pathToCredentials = join(this.homePath, args.filename)
    this.initialize()
  }

  initialize(): void {
    this.createIfNotExists()
  }

  generateId(): number {
    return Math.round(Math.random() * 100000000)
  }

  createIfNotExists(): void {
    if (!pathExists(this.homePath)) create(this.homePath)
  }

  read(): any {
    try {
      return (
        pathExists(this.pathToCredentials) && readJSON(this.pathToCredentials)
      )
    } catch (e) {
      console.warn('Credentials could not be loaded', e)
      return undefined
    }
  }

  write(obj: any): void {
    try {
      writeJSON(this.pathToCredentials, obj)
    } catch (e) {
      console.warn('Credentials could not be overwritten', e)
    }
  }
}

export class GlobalCredentialsHandler extends CredentialsHandler {
  constructor() {
    super({
      homePath: BOTONIC_HOME_DIR,
      filename: GLOBAL_CREDS_FILENAME,
    })
  }

  initialize(): void {
    this.createIfNotExists()
    if (!pathExists(this.pathToCredentials) || !this.hasAnonymousId()) {
      this.refreshAnonymousId()
    }
  }

  hasAnonymousId(): boolean {
    if (!pathExists(this.pathToCredentials)) return false
    const content = this.read()
    return Boolean(content?.analytics?.anonymous_id)
  }

  refreshAnonymousId(): void {
    this.write({
      analytics: { anonymous_id: this.generateId() },
    })
  }

  read(): GlobalCredentials {
    return super.read() as GlobalCredentials
  }

  write(obj: GlobalCredentials): void {
    return super.write(obj)
  }
}

export class BotCredentialsHandler extends CredentialsHandler {
  constructor() {
    super({
      homePath: BOTONIC_PROJECT_PATH,
      filename: BOT_CREDS_FILENAME,
    })
  }

  read(): BotCredentials {
    return super.read() as BotCredentials
  }

  write(obj: BotCredentials): void {
    return super.write(obj)
  }
}
