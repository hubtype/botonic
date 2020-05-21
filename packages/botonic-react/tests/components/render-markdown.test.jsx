import { renderMarkdown } from '../../src/components/markdown'

describe('Using renderMarkdown', () => {
  // Markdown renderer adding an extra blank space after each render
  // Examples taken from: https://markdown-it.github.io/
  const render = text => renderMarkdown(text).trim()

  it('Renders correctly a text', () => {
    const toRender = ['text']
    const sut = render(toRender)
    expect(sut).toEqual('<p>text</p>')
  })

  it('Renders some links', () => {
    const toRender = [
      '## Links Examples',
      '&lt;br&gt;',
      '&lt;br&gt;',
      '\n',
      '---',
      '\n',
      '__Advertisement :)__',
      '\n',
      '- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image resize in browser.',
      '\n',
      ' - __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly i18n with plurals support and easy syntax. You will like those projects!',
      '\n',
      '---',
    ]
    const sut = render(toRender)
    expect(sut).toEqual(
      '<h2>Links Examples<br/><br/></h2>\n' +
        '<hr>\n' +
        '<p><strong>Advertisement :)</strong></p>\n' +
        '<ul>\n' +
        '<li><strong><a href="https://nodeca.github.io/pica/demo/" target="_blank">pica</a></strong> - high quality and fast image resize in browser.</li>\n' +
        '<li><strong><a href="https://github.com/nodeca/babelfish/" target="_blank">babelfish</a></strong> - developer friendly i18n with plurals support and easy syntax. You will like those projects!</li>\n' +
        '</ul>\n' +
        '<hr>'
    )
  })

  it('Renders headings', () => {
    const toRender = [
      '# Headings',
      '&lt;br&gt;',
      '&lt;br&gt;',
      '\n',
      '# h1 Heading',
      '\n',
      '## h2 Heading',
      '\n',
      '### h3 Heading',
      '\n',
      '#### h4 Heading',
      '\n',
      '##### h5 Heading',
      '\n',
      '###### h6 Heading',
    ]
    const sut = render(toRender)
    expect(sut).toEqual(
      '<h1>Headings<br/><br/></h1>\n' +
        '<h1>h1 Heading</h1>\n' +
        '<h2>h2 Heading</h2>\n' +
        '<h3>h3 Heading</h3>\n' +
        '<h4>h4 Heading</h4>\n' +
        '<h5>h5 Heading</h5>\n' +
        '<h6>h6 Heading</h6>'
    )
  })

  it('Renders emphasis', () => {
    const toRender = [
      '## Emphasis',
      '\n',
      '**This is bold text**',
      '\n',
      '__This is bold text__',
      '\n',
      '*This is italic text*',
      '\n',
      '_This is italic text_',
      '\n',
      '~~Strikethrough~~',
    ]
    const sut = render(toRender)
    expect(sut).toEqual(
      '<h2>Emphasis</h2>\n' +
        '<p><strong>This is bold text</strong>\n' +
        '<strong>This is bold text</strong>\n' +
        '<em>This is italic text</em>\n' +
        '<em>This is italic text</em>\n' +
        '<s>Strikethrough</s></p>'
    )
  })

  it('Renders blockquotes', () => {
    const toRender = [
      '## Blockquotes',
      '\n',
      '> Blockquotes can also be nested...',
      '\n',
      '>> ...by using additional greater-than signs right next to each other...',
      '\n',
      '>>> ...or with spaces between arrows.',
    ]
    const sut = render(toRender)
    expect(sut).toEqual(
      '<h2>Blockquotes</h2>\n' +
        '<blockquote>\n' +
        '<p>Blockquotes can also be nested…</p>\n' +
        '<blockquote>\n' +
        '<p>…by using additional greater-than signs right next to each other…</p>\n' +
        '<blockquote>\n' +
        '<p>…or with spaces between arrows.</p>\n' +
        '</blockquote>\n' +
        '</blockquote>\n' +
        '</blockquote>'
    )
  })

  it('Renders tables', () => {
    const toRender = [
      '## Tables\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n<br/><br/>\n',
    ]
    const sut = render(toRender)
    expect(sut).toEqual(
      '<h2>Tables</h2>\n' +
        '<table>\n' +
        '<thead>\n' +
        '<tr>\n' +
        '<th>Option</th>\n' +
        '<th>Description</th>\n' +
        '</tr>\n' +
        '</thead>\n' +
        '<tbody>\n' +
        '<tr>\n' +
        '<td>data</td>\n' +
        '<td>path to data files to supply the data that will be passed into templates.</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td>engine</td>\n' +
        '<td>engine to be used for processing templates. Handlebars is the default.</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td>ext</td>\n' +
        '<td>extension to be used for dest files.</td>\n' +
        '</tr>\n' +
        '</tbody>\n' +
        '</table>\n' +
        '<p><br/><br/></p>'
    )
  })

  it('Renders code blocks', () => {
    const toRender = [
      '``` js\nvar foo = function (bar) {\n    return bar++;\n};\nconsole.log(foo(5));\n```\n#### Was this useful?',
    ]
    const sut = render(toRender)
    expect(sut).toEqual(
      '<pre><code class="language-js">var foo = function (bar) {\n' +
        '    return bar++;\n' +
        '};\n' +
        'console.log(foo(5));\n' +
        '</code></pre>\n' +
        '<h4>Was this useful?</h4>'
    )
  })
})
