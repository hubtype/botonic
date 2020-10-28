import { CMS, CmsException, Context } from '../'
import { Button, Carousel, MessageContent, StartUp, Text } from '../contents'

export function getButtons(content: MessageContent): Button[] {
  if (content instanceof Carousel) {
    return Array.prototype.concat(...content.elements.map(e => e.buttons))
  }
  if (content instanceof Text || content instanceof StartUp) {
    return content.buttons
  }
  return []
}

/**
 * Goes through a content's buttons and followups
 * TODO add cache
 */
export class MessageContentTraverser {
  /**
   * It does not take care of circular loops
   * @param depth
   */
  constructor(
    readonly cms: CMS,
    readonly visitor: (content: MessageContent) => void,
    readonly depth = 1
  ) {
    if (depth > 1) {
      throw new CmsException(
        'Depth>1 not supported yet for MessageContentTraverser'
      )
    }
  }

  async traverse(content: MessageContent, context: Context) {
    const buttons = getButtons(content)
    for (const button of buttons) {
      const contentId = button.callback.asContentId()
      if (contentId) {
        const reference = (await contentId.deliver(
          this.cms,
          context
        )) as MessageContent
        this.visitor(reference)
      }
    }
    while (content.common.followUp) {
      this.visitor(content.common.followUp)
      content = content.common.followUp
    }
  }
}

export async function reachableFrom(
  cms: CMS,
  fromContents: MessageContent[],
  context: Context
): Promise<Set<MessageContent>> {
  const reachable = new Set<MessageContent>()
  const visitor = (content: MessageContent) => {
    reachable.add(content)
  }
  const traverser = new MessageContentTraverser(cms, visitor)
  for (const fromContent of fromContents) {
    await traverser.traverse(fromContent, context)
  }
  return reachable
}

/**
 * To obtain which contents have references (eg. buttons) to a given
 * content
 */
export class MessageContentInverseTraverser {
  private readonly referencesTo = new Map<string, Set<MessageContent>>()

  constructor(
    readonly cms: CMS,
    readonly context: Context,
    readonly depth = 1
  ) {
    if (depth > 1) {
      throw new CmsException(
        'Depth>1 not supported yet for MessageContentInverseTraverser'
      )
    }
  }

  isLoaded(): boolean {
    return this.referencesTo.size > 0
  }

  async load(fromContents?: MessageContent[]) {
    fromContents =
      fromContents ||
      (await allContents<MessageContent>(
        this.cms,
        this.context,
        MESSAGE_CONTENT_TYPES
      ))

    for (const fromContent of fromContents) {
      const reachable = await reachableFrom(
        this.cms,
        [fromContent as MessageContent],
        this.context
      )
      for (const r of reachable) {
        const set = this.referencesTo.get(r.id)
        if (set) {
          set.add(fromContent)
        } else {
          this.referencesTo.set(
            r.id,
            new Set<MessageContent>([fromContent])
          )
        }
      }
    }
  }
  getReferencesTo(contentId: ContentId): Set<MessageContent> {
    return this.referencesTo.get(contentId.id) || new Set<MessageContent>()
  }
}

export async function allContents<T extends Content>(
  cms: CMS,
  context: Context,
  contentTypes: ContentType[]
): Promise<T[]> {
  const contents: T[] = []
  for (const model of contentTypes) {
    for (const c of await cms.contents(model, context)) {
      contents.push(c as T)
    }
  }
  return contents
}
