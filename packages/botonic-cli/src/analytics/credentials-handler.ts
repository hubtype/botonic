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
import {
  createDir,
  getHomeDirectory,
  pathExists,
  readJSON,
  writeJSON,
} from '../util/file-system'

export class CredentialsHandler {
  homeDir: string
  pathToCredentials: string

  constructor(args: CredentialsHandlerArgs) {
    this.homeDir = resolve(args.homeDir)
    this.pathToCredentials = join(this.homeDir, args.filename)
    this.initialize()
  }

  initialize(): void {
    this.createDirIfNotExists()
  }

  generateId(): string {
    return uuidv4()
  }

  createDirIfNotExists(): void {
    if (!pathExists(this.homeDir)) createDir(this.homeDir)
  }

  load(): any {
    try {
      if (!pathExists(this.pathToCredentials)) return undefined
      return readJSON(this.pathToCredentials)
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
    super({
      homeDir: join(getHomeDirectory(), BOTONIC_HOME_DIRNAME),
      filename: GLOBAL_CREDS_FILENAME,
    })
  }

  initialize(): void {
    this.createDirIfNotExists()
    if (!pathExists(this.pathToCredentials) || !this.hasAnonymousId()) {
      this.refreshAnonymousId()
    }
  }

  getAnonymousId(): string {
    const content = this.load()
    return content?.analytics.anonymous_id
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
      homeDir: BOTONIC_PROJECT_PATH,
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
