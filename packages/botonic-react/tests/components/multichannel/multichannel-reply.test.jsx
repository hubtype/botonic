import { Reply } from '../../../src/components'
import { MultichannelReply } from '../../../src/components/multichannel'
import { whatsappRenderer } from '../../helpers/test-utils'

describe('Multichannel replies:', () => {
  const Replies = {}
  Replies.withPayload = (
    <Reply payload='payload1'>reply text with payload1</Reply>
  )
  Replies.withPath = <Reply path='path1'>reply text with path1</Reply>

  test('with payload', () => {
    const sut = (
      <MultichannelReply {...Replies.withPayload.props}>
        {Replies.withPayload.props.children}
      </MultichannelReply>
    )

    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with path', () => {
    const sut = (
      <MultichannelReply {...Replies.withPath.props}>
        {Replies.withPath.props.children}
      </MultichannelReply>
    )

    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })
})
