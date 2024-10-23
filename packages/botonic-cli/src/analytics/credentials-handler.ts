import { join, resolve } from 'path'
import { v7 as uuidv7 } from 'uuid'

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
  JSONObject,
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
    return uuidv7()
  }

  createDirIfNotExists(): void {
    if (!pathExists(this.homeDir)) createDir(this.homeDir)
  }

  loadJSON(): JSONObject | undefined {
    try {
      if (!pathExists(this.pathToCredentials)) return undefined
      return readJSON(this.pathToCredentials)
    } catch (e) {
      console.warn('Credentials could not be loaded')
      return undefined
    }
  }

  dumpJSON(obj: JSONObject): void {
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

  getAnonymousId(): string | undefined {
    const content = this.load()
    return content?.analytics?.anonymous_id
  }

  hasAnonymousId(): boolean {
    if (!pathExists(this.pathToCredentials)) return false
    return Boolean(this.getAnonymousId())
  }

  refreshAnonymousId(): string {
    const newId = this.generateId()
    this.dump({
      analytics: { anonymous_id: newId },
    })
    return newId
  }

  load(): GlobalCredentials | undefined {
    const json = this.loadJSON()
    if (!json) return undefined
    return json as unknown as GlobalCredentials
  }

  dump(obj: GlobalCredentials): void {
    return this.dumpJSON(obj as unknown as JSONObject)
  }
}

export class BotCredentialsHandler extends CredentialsHandler {
  constructor() {
    super({
      homeDir: BOTONIC_PROJECT_PATH,
      filename: BOT_CREDS_FILENAME,
    })
  }

  load(): BotCredentials | undefined {
    const json = this.loadJSON()
    if (!json) return undefined
    return json as unknown as BotCredentials
  }

  dump(obj: BotCredentials): void {
    return this.dumpJSON(obj as unknown as JSONObject)
  }
}
