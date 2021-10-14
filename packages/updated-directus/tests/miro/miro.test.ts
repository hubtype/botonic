import axios from 'axios'

import { ContentId, ContentType } from '../../src/cms'
//import { ContentType, ContentId } from '../../src/cms'
import { testContext, testDirectus } from '../directus/helpers/directus.helper'
import { generateRandomUUID } from '../directus/manage/helpers/utils.helper'

const contentsUrl = 'https://api.miro.com/v1/boards/o9J_lsLgxiU=/widgets/'

test('Test: create bot flow from Miro to Directus', async () => {
  const MiroContents = await axios({
    method: 'get',
    url: contentsUrl,
    headers: { Authorization: 'Bearer 9s2gUTd47e2a0qst_aRMGgiM1pY' },
    params: { widgetType: 'shape' },
  })

  const MiroLinks = await axios({
    method: 'get',
    url: contentsUrl,
    headers: { Authorization: 'Bearer 9s2gUTd47e2a0qst_aRMGgiM1pY' },
    params: { widgetType: 'line' },
  })
  const texts = MiroContents.data.data.filter((content: any) => {
    return content.style.backgroundColor === '#99caff'
  })
  const miroTexts = texts.map((text: any) => {
    return new MiroText(text.id, text.text.split('>')[1].split('<')[0])
  })
  const buttons = MiroContents.data.data.filter((content: any) => {
    return (
      content.style.backgroundColor === '#e6e6e6' ||
      content.style.backgroundColor === '#ffffffff' ||
      content.style.backgroundColor === '#12cdd4'
    )
  })
  const miroButtons = buttons.map((button: any) => {
    return new MiroButton(
      button.id,
      button.text.split('>')[1].split('<')[0],
      isQuickReply(button.style.backgroundColor)
    )
  })
  const links = MiroLinks.data.data.map((link: any) => {
    return new Link(link.startWidget.id, link.endWidget.id)
  })

  const miroContents: MiroContent[] = miroTexts.concat(miroButtons)

  links.forEach((link: Link) => {
    const origin = getContentById(miroContents, link.start)
    const end = getContentById(miroContents, link.end)
    if (origin && origin.type === 'text') {
      if (end && end.type === 'text') {
        ;(origin as MiroText).followup = end as MiroText
      } else if (end && end.type === 'button') {
        ;(origin as MiroText).buttons.push(end as MiroButton)
        if ((end as MiroButton).quickReply) {
          ;(origin as MiroText).buttonsStyle = 'QuickReplies'
        }
      }
    } else if (origin && origin.type === 'button') {
      if (end && end.type === 'text') {
        ;(origin as MiroButton).target = end as MiroText
      }
    } else return
  })

  const directus = testDirectus()

  for (const content of miroContents) {
    const id = generateRandomUUID()
    content.id = id
    await directus.createContent(testContext(), content.type as ContentType, id)
  }

  for (const content of miroContents) {
    if (content.type === 'text') {
      await directus.updateTextFields(testContext(), content.id, {
        text: content.text,
        buttons: (content as MiroText).buttons.map((button: MiroButton) => {
          return button.id
        }),
        followup:
          (content as MiroText).followup &&
          new ContentId(ContentType.TEXT, (content as MiroText).followup!.id),
        buttonsStyle: (content as MiroText).buttonsStyle,
      })
    } else if (content.type === 'button') {
      await directus.updateButtonFields(testContext(), content.id, {
        text: content.text,
        target:
          (content as MiroButton).target &&
          new ContentId(ContentType.TEXT, (content as MiroButton).target!.id),
      })
    }
  }

  //   for (const content of miroContents) {
  //     await directus.deleteContent(
  //       testContext(),
  //       content.type as ContentType,
  //       content.id
  //     )
  //   }
})

type MiroContentType = 'button' | 'text' | 'payload'

class Link {
  readonly start: string
  readonly end: string
  constructor(start: string, end: string) {
    this.start = start
    this.end = end
  }
}

class MiroContent {
  readonly type: MiroContentType
  id: string
  readonly text: string
  constructor(id: string, text: string, type: MiroContentType) {
    this.type = type
    this.id = id
    this.text = text
  }
}

class MiroButton extends MiroContent {
  target?: MiroText
  readonly quickReply: boolean
  constructor(id: string, text: string, quickReply: boolean) {
    super(id, text, 'button')
    this.quickReply = quickReply
  }
}

type ButtonsStyle = 'QuickReplies' | 'Buttons'

class MiroText extends MiroContent {
  buttons: MiroButton[]
  followup?: MiroText
  buttonsStyle?: ButtonsStyle
  constructor(id: string, text: string) {
    super(id, text, 'text')
    this.buttons = []
  }
}

function getContentById(contents: MiroContent[], id: string): MiroContent {
  const content = contents.filter((content: MiroContent) => {
    return content.id === id
  })
  return content[0]
}

function isQuickReply(backgroundColor: string): boolean {
  return backgroundColor === '#12cdd4' ? true : false
}
