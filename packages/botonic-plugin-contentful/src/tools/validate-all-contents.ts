import {
  CMS,
  Context,
  MessageContent,
  TOP_CONTENT_TYPES,
  TopContent,
} from '../cms'
import { reachableFrom } from '../cms/visitors/message-visitors'

export function defaultValidationReport(id: string, error: string) {
  console.log(`${id}: ${error}`)
}

export class ContentsValidator {
  constructor(
    readonly cms: CMS,
    readonly report: (
      id: string,
      error: string
    ) => void = defaultValidationReport,
    readonly onlyValidateReachable = true
  ) {}

  /**
   * Deliver all TopContent's to validate that they won't fail in production.
   * A content delivery might fail if:
   * - It has a link to a deleted content
   * - There are infinite loops
   * - There's a bug on the CMS plugin
   * - An URL has empty URL empty
   */
  async validateAllTopContents(context: Context): Promise<void> {
    context = { ...context, fixMissingData: false }
    const contents: MessageContent[] = []
    for (const model of TOP_CONTENT_TYPES) {
      contents.push(
        ...((await this.cms.topContents(model, context)) as MessageContent[])
      )
    }
    const contentsToValidate = this.onlyValidateReachable
      ? await this.reachableContents(contents, context)
      : contents
    for (const c of contentsToValidate) {
      this.validate(c)
    }
  }

  protected async reachableContents(
    allContents: MessageContent[],
    context: Context
  ): Promise<Iterable<MessageContent>> {
    const reachable = await reachableFrom(this.cms, allContents, context)
    allContents.filter(c => c.isSearchable()).forEach(c => reachable.add(c))
    return reachable
  }

  protected validate(content: TopContent) {
    const res = content.validate()
    if (res) {
      this.report(content.id, res)
    }
  }
}
