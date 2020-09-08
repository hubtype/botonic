import { Carousel, MessageContent, Text, StartUp, Button } from '../contents'
import { CMS, CmsException, Context } from '../'

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
