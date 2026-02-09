import TestRenderer from 'react-test-renderer'

import { Button } from '../../src/components/button'
import { Reply } from '../../src/components/reply'
import { Text } from '../../src/components/text'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

describe('Text Component', () => {
  test('Just one Text', () => {
    const sut = <Text>Just one Text</Text>
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('Text with <BR>: markdown disabled', () => {
    const sut = (
      <Text markdown={0}>
        hi
        <br />
        bye
      </Text>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('Text with <BR>: markdown enabled', () => {
    const sut = (
      <Text>
        hi
        <br />
        bye
      </Text>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('Text with 1 button', () => {
    const sut = (
      <Text>
        Text with 1 button
        <Button key={'1'} payload='payload1'>
          Text 1
        </Button>
      </Text>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('Text with N button', () => {
    const sut = (
      <Text>
        Text with N button
        {[
          <Button key={'1'} payload='payload1'>
            Text 1
          </Button>,
          <Button key={'2'} payload='payload2'>
            Text 2
          </Button>,
        ]}
      </Text>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('N Text with N button', () => {
    const sut = (
      <>
        {[1, 2].map((e, i) => {
          return (
            <Text key={i}>
              N Text with N button {i + 1}
              <Button payload={`payload${i + 1}`}>Button Text {i + 1}</Button>
            </Text>
          )
        })}
      </>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })
  test('Text with 1 reply', () => {
    const sut = (
      <Text>
        Text with 1 reply
        <Reply key={'1'} payload='payload1'>
          Text Reply 1
        </Reply>
      </Text>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('Text with N replies', () => {
    const sut = (
      <Text>
        Text with N replies
        {[
          <Reply key={'1'} payload='payload1'>
            Text Reply 1
          </Reply>,
          <Reply key={'2'} payload='payload2'>
            Text Reply 2
          </Reply>,
        ]}
      </Text>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })

  test('N Text with N replies', () => {
    const sut = (
      <>
        {[1, 2].map((e, i) => {
          return (
            <Text key={i}>
              N Text with N replies {i + 1}
              <Reply payload={`payload${i + 1}`}>Reply Text {i + 1}</Reply>
            </Text>
          )
        })}
      </>
    )
    const tree = renderToJSON(sut)
    expect(tree).toMatchSnapshot()
  })
})
