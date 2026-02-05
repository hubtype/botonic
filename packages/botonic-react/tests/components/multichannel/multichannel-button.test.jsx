import { MultichannelButton } from '../../../src/components/multichannel'
import { whatsappRenderer } from '../../helpers/test-utils'

describe('Multichannel buttons:', () => {
  test('with payload', () => {
    const sut = (
      <MultichannelButton payload='payload1'>With payload</MultichannelButton>
    )

    const rendered = whatsappRenderer(sut, { indexSeparator: '-' }).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with path', () => {
    const sut = <MultichannelButton path='path1'>With path</MultichannelButton>

    const rendered = whatsappRenderer(sut, { indexSeparator: '.-' }).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with URL', () => {
    const sut = (
      <MultichannelButton url='https://docs.botonic.io/'>
        With URL
      </MultichannelButton>
    )
    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with webview', () => {
    const sut = (
      <MultichannelButton webview='webview'>With webview</MultichannelButton>
    )
    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('truncate text if more than 20 chars in whatsapp buttons', () => {
    const sut = (
      <MultichannelButton asText={false} payload='payload1'>
        With text longer than 20 characters
      </MultichannelButton>
    )
    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })
})
