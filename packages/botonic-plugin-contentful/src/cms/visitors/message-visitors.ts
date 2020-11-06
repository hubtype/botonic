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
      throw new CmsException('Not supported yet')
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
