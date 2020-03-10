import { ContextWithLocale } from '../cms'

export interface ManageContext extends ContextWithLocale {
  allowOverwrites?: boolean
  /** When preview, the content will be changed but not yet published */
  preview: boolean
  dryRun?: boolean
}
