import { MarkupType, WhatsApp } from '../../src/markup'
import { createMarkUp } from '../../src/markup/factories'

test('TEST whatsapp', () => {
  const tokens = createMarkUp(MarkupType.MARKDOWN).parse(`# *italics* header
* list with __bold__
Escaped \\*`)

  const render = new WhatsApp().render(tokens)

  expect(render).toEqual(`_italics_ header
list with *bold*
Escaped *`)
})
