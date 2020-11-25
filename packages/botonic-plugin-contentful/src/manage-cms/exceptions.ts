import { CmsException, ResourceId } from '../cms'

/**
 * The resource cannot be updated because it has just been updated
 * by another process (eg. when updates require previously reading the
 * previous value, which contains a version number)
 */
export class UpdateConflictException extends CmsException {
  constructor(readonly resourceId?: ResourceId) {
    super('Conflict updating a resource', resourceId)
  }
}
