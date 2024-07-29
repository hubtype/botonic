import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowWhatsappButtonList } from '../../src/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents of a WhatsApp Button List node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The contents of the WhatsApp Button List are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: { input: { data: 'flowButtonList', type: INPUT.TEXT } },
    })

    const buttonListContent = contents[0] as FlowWhatsappButtonList
    expect(buttonListContent.text).toBe('WhatsApp button list')
    expect(buttonListContent.listButtonText).toBe('Menu')

    const buttonListSections = buttonListContent.sections
    expect(buttonListSections.length).toBeGreaterThanOrEqual(1)

    const firstSection = buttonListSections[0]
    expect(firstSection.title).toBe('Section 1')

    const rows = firstSection.rows
    expect(rows.length).toBeGreaterThan(3)

    const firstRow = rows[0]
    expect(firstRow.title).toBe('Row title 1')
    expect(firstRow.description).toBe('Row description 1')
    expect(firstRow.targetId).toBe('128970b5-3404-472c-a0e7-b6aaa8d38bc9')
  })
})
