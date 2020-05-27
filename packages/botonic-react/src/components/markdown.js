import MarkdownIt from 'markdown-it'

const BR_STRING_TAG = '<br/>'
const BR_STRING_TAG_REGEX = new RegExp('<br\\s*/?>', 'g')
export const ESCAPED_LINE_BREAK = '&lt;br&gt;'
const ESCAPED_LINE_BREAK_REGEX = new RegExp(ESCAPED_LINE_BREAK, 'g')
const isLineBreakElement = element => element.type === 'br'

const withLinksTarget = (renderer, target = '_blank') => {
  // Support opening links in new tabs: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
  const newRenderer =
    renderer.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }
  renderer.renderer.rules.link_open = function (
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const aIndex = tokens[idx].attrIndex('target')
    if (aIndex < 0) tokens[idx].attrPush(['target', target])
    else tokens[idx].attrs[aIndex][1] = target
    return newRenderer(tokens, idx, options, env, self)
  }
}

const configureLinksRenderer = () => {
  // zero preset comes with all options disabled, only enabling links
  const linksRenderer = new MarkdownIt('zero', { linkify: true }).enable([
    'linkify',
  ])
  withLinksTarget(linksRenderer)
  return linksRenderer
}

const configureMarkdownRenderer = () => {
  const markdownRenderer = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
  withLinksTarget(markdownRenderer)
  return markdownRenderer
}

const markdownRenderer = configureMarkdownRenderer()
export const renderMarkdown = text => {
  // markdown-it renderer expects '<br/>' strings to render correctly line breaks
  // Supporting multiline: https://stackoverflow.com/a/20543835
  text = text
    .map(e => {
      if (isLineBreakElement(e)) return BR_STRING_TAG
      else if (typeof e === 'string')
        return e
          .replace(BR_STRING_TAG_REGEX, BR_STRING_TAG)
          .replace(ESCAPED_LINE_BREAK_REGEX, BR_STRING_TAG)
      else return String(e)
    })
    .join('')
  return markdownRenderer.render(text)
}

const linksRenderer = configureLinksRenderer()
export const renderLinks = text => {
  return linksRenderer.render(text)
}

export const serializeMarkdown = children => {
  children = Array.isArray(children) ? children : [children]
  const text = children
    .filter(e => isLineBreakElement(e) || !e.type)
    .map(e => {
      if (Array.isArray(e)) return serializeMarkdown(e)
      if (isLineBreakElement(e)) return ESCAPED_LINE_BREAK
      else return String(e).replace(BR_STRING_TAG_REGEX, ESCAPED_LINE_BREAK)
    })
    .join('')
  return text
}

export const toMarkdownChildren = children =>
  children.map(e => (isLineBreakElement(e) ? ESCAPED_LINE_BREAK : e))

export const getMarkdownStyle = (getThemeFn, defaultColor) =>
  getThemeFn('markdownStyle', getDefaultMarkdownStyle(defaultColor))

export const getDefaultMarkdownStyle = color => `
*{
  margin: 0px;
}

a {
  text-decoration:none;
}

a:link{
  color:${color}; 
}

a:visited {
  color:${color};
}

a:hover {
  text-shadow: 0px 1px black;
}

blockquote {
  margin: 0;
  padding-left: 1.4rem;
  border-left: 4px solid #dadada; 
}

pre code {
  margin: 0;
  padding: 0;
  white-space: pre;
  border: none;
  background: transparent; 
}

pre {
  background-color: #f8f8f8;
  border: 1px solid #cccccc;
  font-size: 13px;
  line-height: 19px;
  overflow: auto;
  padding: 6px 10px;
  border-radius: 3px; 
}

code, tt {
  margin: 0 2px;
  padding: 0 5px;
  white-space: nowrap;
  border: 1px solid #eaeaea;
  background-color: #f8f8f8;
  border-radius: 3px; 
}

pre {
  background-color: #f8f8f8;
  border: 1px solid #cccccc;
  font-size: 13px;
  line-height: 19px;
  overflow: auto;
  padding: 6px 10px;
  border-radius: 3px; 
}

pre code, pre tt {
  background-color: transparent;
  border: none; 
}
  
table, td, th {
  border: 1px solid black;
  padding:10px;
}
`
