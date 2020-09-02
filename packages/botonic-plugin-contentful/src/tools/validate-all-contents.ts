import { CMS, ContextWithLocale, TOP_CONTENT_TYPES } from '../cms'
import { asyncEach } from '../util/async'

export class ContentsValidator {
  constructor(readonly cms: CMS) {}

  /**
   * Deliver all TopContent's to validate that they won't fail in production.
   * A content delivery might fail if:
   * - It has a link to a deleted content
   * - There are infinite loops
   * - There's a bug on the CMS plugin
   */
  async validateAllTopContents(context: ContextWithLocale): Promise<void> {
    await asyncEach(
      context,
      TOP_CONTENT_TYPES,
      ct => this.cms.topContents(ct, context),
      // topContents will internally manage concurrency
      1
    )
  }
}
