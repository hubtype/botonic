import { Text } from '../../src/components/text'

describe('Text serialization', () => {
  test.each([
    <Text key={'msgSimple1'} markdown={true}>
      Just text
    </Text>,
    <Text key={'msgSimple2'} markdown={false}>
      Just text
    </Text>,
    <Text key={'heading1Simple1'} markdown={true}>
      # Heading 1
    </Text>,
    <Text key={'heading1Simple2'} markdown={false}>
      # Heading 1
    </Text>,
  ])(`Simple text`, textComponent => {
    const sut = Text.serialize(textComponent.props)
    expect(sut).toEqual({ text: textComponent.props.children })
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
