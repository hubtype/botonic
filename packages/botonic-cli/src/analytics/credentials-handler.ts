import { homedir } from 'os'
import { join, resolve } from 'path'
import { v4 as uuidv4 } from 'uuid'

import {
  BOT_CREDS_FILENAME,
  BOTONIC_HOME_DIRNAME,
  BOTONIC_PROJECT_PATH,
  GLOBAL_CREDS_FILENAME,
} from '../constants'
import {
  BotCredentials,
  CredentialsHandlerArgs,
  GlobalCredentials,
} from '../interfaces'
import { create, pathExists, readJSON, writeJSON } from '../util/file-system'
import { execCommand, isWindows } from '../util/processes'

export class CredentialsHandler {
  homePath: string
  pathToCredentials: string

  constructor(args: CredentialsHandlerArgs) {
    this.homePath = resolve(args.homePath)
    this.pathToCredentials = join(this.homePath, args.filename)
    this.initialize()
  }

  initialize(): void {
    this.createIfNotExists()
  }

  generateId(): string {
    return uuidv4()
  }

  createIfNotExists(): void {
    if (!pathExists(this.homePath)) create(this.homePath)
  }

  load(): any {
    try {
      return (
        pathExists(this.pathToCredentials) && readJSON(this.pathToCredentials)
      )
    } catch (e) {
      console.warn('Credentials could not be loaded')
      return undefined
    }
  }

  dump(obj: any): void {
    try {
      writeJSON(this.pathToCredentials, obj)
    } catch (e) {
      console.warn('Credentials could not be overwritten')
    }
  }
}

export class GlobalCredentialsHandler extends CredentialsHandler {
  constructor() {
    const homeDirectory = isWindows()
      ? homedir()
      : execCommand('eval echo ~${SUDO_USER}')
    super({
      homePath: join(homeDirectory, BOTONIC_HOME_DIRNAME),
      filename: GLOBAL_CREDS_FILENAME,
    })
  }

  initialize(): void {
    this.createIfNotExists()
    if (!pathExists(this.pathToCredentials) || !this.hasAnonymousId()) {
      this.refreshAnonymousId()
    }
  }

  getAnonymousId(): string {
    try {
      const content = this.load()
      return content?.analytics?.anonymous_id
    } catch (e) {
      return ''
    }
  }

  hasAnonymousId(): boolean {
    if (!pathExists(this.pathToCredentials)) return false
    return Boolean(this.getAnonymousId())
  }

  refreshAnonymousId(): void {
    this.dump({
      analytics: { anonymous_id: this.generateId() },
    })
  }

  load(): GlobalCredentials {
    return super.load() as GlobalCredentials
  }

  dump(obj: GlobalCredentials): void {
    return super.dump(obj)
  }
}

export class BotCredentialsHandler extends CredentialsHandler {
  constructor() {
    super({
      homePath: BOTONIC_PROJECT_PATH,
      filename: BOT_CREDS_FILENAME,
    })
  }

  load(): BotCredentials {
    return super.load() as BotCredentials
  }

  dump(obj: BotCredentials): void {
    return super.dump(obj)
  }
}
