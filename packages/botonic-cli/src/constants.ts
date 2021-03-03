import { homedir } from 'os'
import { join } from 'path'

export const BOTONIC_HOME_DIR = join(homedir(), '.botonic')
export const GLOBAL_CREDS_FILENAME = 'credentials.json'
export const BOTONIC_PROJECT_PATH = process.cwd()
export const BOT_CREDS_FILENAME = '.botonic.json'
export const ANALYTICS_WRITE_KEY = 'YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu'
export const TRACKING_EVENTS = {
  INSTALLED_BOTONIC: 'Installed Botonic CLI',
  LOGGED_IN: 'Logged In Botonic CLI',
  LOGGED_OUT: 'Logged Out Botonic CLI',
  CREATED_BOT: 'Created Botonic Bot CLI',
  SERVED_BOT: 'Served Botonic CLI',
  TESTED_BOT: 'botonic test',
  TRAINED_BOT: 'Trained with Botonic train',
  DEPLOYED_BOT: 'Deployed Botonic CLI',
  ERROR_BOTONIC_CLI: 'Error Botonic CLI',
}
