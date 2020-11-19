import { CMS, ErrorReportingCMS } from '../cms'
import { ManageCms } from '../manage-cms'
import { ErrorReportingManageCms } from '../manage-cms/manage-cms-error'
import { ContentfulOptions } from '../plugin'
import { Contentful } from './cms-contentful'
import { ManageContentful } from './manage'

export function createCms(
  options: ContentfulOptions,
  errorReporting = true
): CMS {
  const contentful = new Contentful(options)
  if (!errorReporting) {
    return contentful
  }
  return new ErrorReportingCMS(contentful)
}

export function createManageCms(
  options: ContentfulOptions,
  errorReporting = true
): ManageCms {
  const contentful = new ManageContentful(options)
  if (!errorReporting) {
    return contentful
  }
  return new ErrorReportingManageCms(contentful)
}
