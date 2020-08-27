import { CMS, ContextWithLocale, TOP_CONTENT_TYPES } from '../cms'
import * as Parallel from 'async-parallel'

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
    // topContents will internally limit concurrency
    const concurrency = context.concurrency && 1
    await Parallel.each(
      TOP_CONTENT_TYPES,
      ct => this.cms.topContents(ct, context),
      concurrency
    )
  }
}
