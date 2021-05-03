import { ContextWithLocale } from '../cms'

export interface ManageContext extends ContextWithLocale {
  allowOverwrites?: boolean
  /** When preview, the content will be changed but not yet published. However when deleting contents they will allways be directly removed*/
  preview: boolean
  dryRun?: boolean
}
