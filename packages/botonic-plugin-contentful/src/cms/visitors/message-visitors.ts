import { andArrays } from '../../util/arrays'
import { asyncEach } from '../../util/async'
import {
  CMS,
  CmsException,
  Content,
  ContentId,
  ContentType,
  Context,
  MESSAGE_CONTENT_TYPES,
  MessageContentType,
  TOP_CONTENT_TYPES,
  TopContent,
} from '../'
import { CmsInfo } from '../cms-info'
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

export interface MessageContentTraverserOptions {
  /** default is 1 */
  depth: number
  /** true to ignore button references */
  ignoreButtons: boolean
  /** true to ignore followUp references */
  ignoreFollowUps: boolean
}
/**
 * Goes through a content's buttons and followups
 * TODO add cache
 */
export class MessageContentTraverser {
  options: MessageContentTraverserOptions
  /**
   * It does not take care of circular loops
   */
  constructor(
    readonly cms: CMS,
    readonly visitor: (content: MessageContent) => void,
    options: Partial<MessageContentTraverserOptions> = {}
  ) {
    this.options = {
      depth: 1,
      ignoreButtons: false,
      ignoreFollowUps: false,
      ...options,
    }
    if (this.options.depth > 1) {
      throw new CmsException(
        'Depth>1 not supported yet for MessageContentTraverser'
      )
    }
  }

  async traverse(content: MessageContent, context: Context): Promise<void> {
    const promises: Promise<void>[] = []
    if (!this.options.ignoreButtons) {
      promises.push(this.traverseButtons(content, context))
    }
    if (!this.options.ignoreFollowUps) {
      this.traverseFollowUps(content)
    }
    await Promise.all(promises)
  }

  async traverseButtons(
    content: MessageContent,
    context: Context
  ): Promise<void> {
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
  }

  traverseFollowUps(content: MessageContent): void {
    while (content.common?.followUp) {
      this.visitor(content.common.followUp)
      content = content.common.followUp
    }
  }
}

export async function reachableFrom(
  cms: CMS,
  fromContents: MessageContent[],
  context: Context,
  options: Partial<MessageContentTraverserOptions> = {}
): Promise<Set<MessageContent>> {
  const reachable = new Set<MessageContent>()
  const visitor = (content: MessageContent) => {
    reachable.add(content)
  }
  const traverser = new MessageContentTraverser(cms, visitor, options)
  await asyncEach(context, fromContents, fromContent =>
    traverser.traverse(fromContent, context)
  )
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
    readonly info: CmsInfo,
    readonly context: Context,
    readonly options: Partial<MessageContentTraverserOptions> = {}
  ) {
    if (options.depth && options.depth > 1) {
      throw new CmsException(
        'Depth>1 not supported yet for MessageContentInverseTraverser'
      )
    }
  }

  isLoaded(): boolean {
    return this.referencesTo.size > 0
  }

  async messageContentTypes() {
    return andArrays(MESSAGE_CONTENT_TYPES, await this.info.contentTypes())
  }

  async load(fromContents?: MessageContent[]) {
    fromContents =
      fromContents ||
      (await allMessageContents(
        this.cms,
        this.context,
        await this.messageContentTypes()
      ))

    for (const fromContent of fromContents) {
      const reachable = await reachableFrom(
        this.cms,
        [fromContent],
        this.context,
        this.options
      )
      for (const r of reachable) {
        const set = this.referencesTo.get(r.id)
        if (set) {
          set.add(fromContent)
        } else {
          this.referencesTo.set(r.id, new Set<MessageContent>([fromContent]))
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

export async function allTopContents(
  cms: CMS,
  context: Context,
  contentTypes = TOP_CONTENT_TYPES
): Promise<TopContent[]> {
  return allContents(cms, context, contentTypes)
}

export async function allMessageContents(
  cms: CMS,
  context: Context,
  contentTypes = MESSAGE_CONTENT_TYPES
): Promise<MessageContent[]> {
  return allContents(cms, context, contentTypes)
}
