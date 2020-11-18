import { ContentCallback, TopContentId } from '../cms'
import {
  getButtons,
  MessageContentInverseTraverser,
} from '../cms/visitors/message-visitors'
import {
  CONTENT_FIELDS,
  ContentFieldType,
  getFieldsForContentType,
} from './fields'
import { ManageCms } from './manage-cms'
import { ManageContext } from './manage-context'

/**
 * Deletes fields and the references from other contents that reference the
 * content through a button.
 */
export class ContentDeleter {
  constructor(
    readonly manageCms: ManageCms,
    readonly inverseTraverser: MessageContentInverseTraverser,
    readonly context: ManageContext
  ) {}

  async deleteContent(contentId: TopContentId, name?: string): Promise<void> {
    console.log(
      `Deleting fields and references to ${contentId.toString()} ${String(
        name
      )} for locale ${this.context.locale}`
    )
    await this.deleteFields(contentId)
    await this.deleteReferencesTo(contentId)
  }

  private async deleteFields(contentId: TopContentId): Promise<void> {
    const fields = getFieldsForContentType(contentId.model)
    const newVal: { [field: string]: any } = {}
    for (const field of fields) {
      const f = CONTENT_FIELDS.get(field)!
      if (!f.isLocalized) continue
      // const fieldType = contentFiedByCmsName(field).fieldType
      newVal[field] = undefined
      // switch (f.valueType) {
      //   case ContentFieldValueType.STRING:
      //     newVal[f.cmsName] = ''
      //   case ContentFieldValueType.STRING:
      //     newVal[f.cmsName] = ''
      // }
    }
    await this.manageCms.updateFields(this.context, contentId, newVal)
  }

  private async deleteReferencesTo(contentId: TopContentId) {
    if (!this.inverseTraverser.isLoaded()) {
      await this.inverseTraverser.load()
    }
    const sourceContents = this.inverseTraverser.getReferencesTo(contentId)
    for (const source of sourceContents) {
      const referenceStr = `Button from ${source.toString()} to ${contentId.toString()}`
      const originalButtons = getButtons(source)
      if (
        originalButtons.filter(b => !(b.callback instanceof ContentCallback))
          .length
      ) {
        console.error(
          `${referenceStr} cannot be updated because a button contains a payload.` +
            ' Remove it manually'
        )
        continue
      }
      const buttons = originalButtons
        .filter(b => !b.callback.equals(ContentCallback.ofContentId(contentId)))
        .map(b => ({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: (b.callback as ContentCallback).id,
          },
        }))
      if (buttons.length == originalButtons.length) {
        console.error(`${referenceStr} not found`)
        continue
      }
      // TODO do it in parallel
      await this.manageCms.updateFields(this.context, source.contentId, {
        [ContentFieldType.BUTTONS]: buttons,
      })
    }
  }
}
