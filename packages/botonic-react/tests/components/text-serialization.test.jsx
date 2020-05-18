import React from 'react'
import { Text } from '../../src/components/text'
import { Button } from '../../src/components/button'

describe('Text serialization', () => {
  it('Serializes a simple text', () => {
    const text = <Text markdown={true}>Just text</Text>
    const sut = Text.serialize(text.props)
    expect(sut).toEqual({ text: 'Just text' })
  })

  it('Serializes a simple text (markdown={false})', () => {
    const text = <Text markdown={false}>Just text</Text>
    const sut = Text.serialize(text.props)
    expect(sut).toEqual({ text: 'Just text' })
  })

  it('Serializes a simple markdown heading', () => {
    const text = <Text markdown={true}># Heading 1</Text>
    const sut = Text.serialize(text.props)
    expect(sut).toEqual({ text: '# Heading 1' })
  })

  it('Serializes a simple markdown heading (markdown={false})', () => {
    const text = <Text markdown={false}># Heading 1</Text>
    const sut = Text.serialize(text.props)
    expect(sut).toEqual({ text: '# Heading 1' })
  })

  it('Not converted to Markdown as markdown={false}', () => {
    const component = (
      <Text markdown={false}>
        # H1
        {'\n'}
        {'\n'}## H2
      </Text>
    )
    const sut = Text.serialize(component.props)
    expect(sut).toEqual({
      text: '# H1\n\n## H2',
    })
  })

  it('Serializes correctly Markdown (mode 1)', () => {
    const component = (
      <Text markdown={true}>
        # H1
        {'\n'}
        <br />
        <br />
        {'\n'}## H2
      </Text>
    )
    const sut = Text.serialize(component.props)
    expect(sut).toEqual({
      text: '# H1\n&lt;br&gt;&lt;br&gt;\n## H2',
    })
  })

  it('Serializes correctly Markdown (mode 2)', () => {
    const generateMd = () => '# H1\n<br/><br/>\n## H2'
    const component = <Text markdown={true}>{generateMd()}</Text>
    const sut = Text.serialize(component.props)
    expect(sut).toEqual({
      text: '# H1\n&lt;br&gt;&lt;br&gt;\n## H2',
    })
  })
})
