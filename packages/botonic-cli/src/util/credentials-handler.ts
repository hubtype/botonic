import {join, resolve} from 'path'

import {
  BOT_CREDENTIALS_FILENAME,
  BOTONIC_HOME_DIRNAME,
  BOTONIC_PROJECT_PATH,
  GLOBAL_CREDENTIALS_FILENAME,
} from '../constants.js'
import {BotCredentials, CredentialsHandlerArgs, GlobalCredentials, JSONObject} from '../interfaces.js'
import {createDir, getHomeDirectory, pathExists, readJSON, writeJSON} from '../util/file-system.js'

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
      filename: GLOBAL_CREDENTIALS_FILENAME,
    })
  }

  initialize(): void {
    this.createDirIfNotExists()
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
    super({homeDir: BOTONIC_PROJECT_PATH, filename: BOT_CREDENTIALS_FILENAME})
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
