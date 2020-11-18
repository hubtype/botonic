import { ContentType } from './cms'

export interface CmsInfo {
  contentTypes(): Promise<ContentType[]>
}
