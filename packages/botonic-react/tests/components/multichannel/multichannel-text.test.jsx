import { Text } from '../../../src/components'
import {
  MultichannelButton,
  MultichannelText,
} from '../../../src/components/multichannel'
import { MultichannelReply } from '../../../src/components/multichannel/multichannel-reply'
import { whatsappRenderer } from '../../helpers/test-utils'

const LEGACY_CONTEXT = {
  indexSeparator: '.',
  messageSeparator: null,
}
const LEGACY_PROPS = {
  indexMode: 'number',
}

const CONTEXT_WITH_BUTTONS = {
  text: {
    buttonsAsText: false,
  },
}
const CONTEXT_WITH_BUTTONS_CUSTOM = {
  text: {
    buttonsAsText: false,
    buttonsTextSeparator: 'Custom message',
  },
}

const AS_BUTTONS_PROPS = {
  buttonsAsText: false,
}
const AS_BUTTONS_PROPS_CUSTOM = {
  buttonsAsText: false,
  buttonsTextSeparator: 'Custom message',
}

describe('Multichannel text', () => {
  test('just text', () => {
    const text = <Text>Some text</Text>
    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with buttons plain', () => {
    const text = (
      <Text>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' url='http://adrss'>
          button text2
        </MultichannelButton>
        <MultichannelButton key='2' path='path'>
          button text3
        </MultichannelButton>
      </Text>
    )
    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with buttons as array', () => {
    const text = (
      <Text>
        The verbose text
        {[
          <MultichannelButton key={'0'} payload={'payload1'}>
            button text1
          </MultichannelButton>,
          <MultichannelButton key={'1'} url='http://adrss'>
            button text2
          </MultichannelButton>,
          <MultichannelButton key={'2'} path='path'>
            button text3
          </MultichannelButton>,
        ]}
      </Text>
    )

    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with replies plain', () => {
    const text = (
      <Text>
        Quick replies
        <MultichannelReply key='0' payload='payload1'>
          reply text1
        </MultichannelReply>
        <MultichannelReply key='2' path='path'>
          reply text2
        </MultichannelReply>
      </Text>
    )
    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with replies as array', () => {
    const text = (
      <Text>
        The verbose text
        {[
          <MultichannelReply key='0' payload='payload1'>
            reply text1
          </MultichannelReply>,
          <MultichannelReply key='2' path='path'>
            reply text2
          </MultichannelReply>,
        ]}
      </Text>
    )

    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('display postback buttons as whatsapp buttons', () => {
    const sut = (
      <MultichannelText {...AS_BUTTONS_PROPS}>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' path='path'>
          button text2
        </MultichannelButton>
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, CONTEXT_WITH_BUTTONS)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('display URL buttons as text even if buttonsAsText is set to false', () => {
    const sut = (
      <MultichannelText {...AS_BUTTONS_PROPS}>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' url='http://adrss'>
          button text2
        </MultichannelButton>
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, CONTEXT_WITH_BUTTONS)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('split webview buttons into separate messages', () => {
    const sut = (
      <MultichannelText {...AS_BUTTONS_PROPS}>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' webview='webview'>
          webview button text
        </MultichannelButton>
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, CONTEXT_WITH_BUTTONS)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('split messages with more than 3 postback buttons into separate messages', () => {
    const sut = (
      <MultichannelText {...AS_BUTTONS_PROPS}>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' url='http://adrss'>
          button text2
        </MultichannelButton>
        <MultichannelButton key='2' path='path'>
          button text3
        </MultichannelButton>
        <MultichannelButton key='3' webview='webview'>
          button text4
        </MultichannelButton>
        <MultichannelButton key='4' payload='payload2'>
          button with text longer than 20 chars
        </MultichannelButton>
        <MultichannelButton key='5' payload='payload3'>
          button text5
        </MultichannelButton>
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, CONTEXT_WITH_BUTTONS)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('split messages with more than 3 postback buttons into separate messages (without webview buttons)', () => {
    const sut = (
      <MultichannelText {...AS_BUTTONS_PROPS}>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' url='http://adrss'>
          button text2
        </MultichannelButton>
        <MultichannelButton key='2' path='path'>
          button text3
        </MultichannelButton>
        <MultichannelButton key='4' payload='payload2'>
          button with text longer than 20 chars
        </MultichannelButton>
        <MultichannelButton key='5' payload='payload3'>
          button text5
        </MultichannelButton>
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, CONTEXT_WITH_BUTTONS)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('display custom text as button separator when more than 3 buttons in message', () => {
    const sut = (
      <MultichannelText {...AS_BUTTONS_PROPS_CUSTOM}>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' url='http://adrss'>
          button text2
        </MultichannelButton>
        <MultichannelButton key='2' path='path'>
          button text3
        </MultichannelButton>
        <MultichannelButton key='3' webview='webview'>
          button text4
        </MultichannelButton>
        <MultichannelButton key='4' payload='payload2'>
          button with text longer than 20 chars
        </MultichannelButton>
        <MultichannelButton key='5' payload='payload3'>
          button text5
        </MultichannelButton>
        <MultichannelButton key='6' payload='payload4'>
          button text5
        </MultichannelButton>
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, CONTEXT_WITH_BUTTONS_CUSTOM)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
