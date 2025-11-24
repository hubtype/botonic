import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../../src/content-fields/index'
import { ContentFilter, ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from '../__mocks__/smart-intent'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Content filters', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  test('should remove the button with text "Talk to an agent" from the FlowText content', async () => {
    const removeButtonFilter: ContentFilter = (_request, content) => {
      if (content instanceof FlowText) {
        content.buttons = content.buttons.filter(
          button => button.text !== 'Talk to an agent'
        )
      }
      return content
    }
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: basicFlow,
        contentFilters: [removeButtonFilter],
      },
      requestArgs: {
        input: { data: 'Hello', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect(contents).toHaveLength(3)
    expect((contents[2] as FlowText).buttons).toHaveLength(4)
    expect((contents[2] as FlowText).buttons[0].text).toBe('Add a bag')
    expect((contents[2] as FlowText).buttons[1].text).toBe('Select a seat')
    expect((contents[2] as FlowText).buttons[2].text).toBe('Conditionals')
    expect((contents[2] as FlowText).buttons[3].text).toBe('Different messages')
  })
})
