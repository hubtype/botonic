export const MAX_CHARACTERS_FACEBOOK = 640

export class MultichannelFacebook {
  constructor() {}

  convertText(props, originalText) {
    if (originalText.length > MAX_CHARACTERS_FACEBOOK) {
      const texts = this.splitText(originalText)
      const lastText = texts.pop()
      const { propsLastText, propsWithoutChildren } = this.getNewProps(
        props,
        lastText
      )
      return { texts, propsLastText, propsWithoutChildren }
    }
    return { propsLastText: props }
  }

  splitText(originalText) {
    const lines = originalText.split('\n')
    const initialText = lines.shift()
    const texts = [initialText]
    let index = 0
    lines.forEach(currentText => {
      if (texts[index].length + currentText.length > MAX_CHARACTERS_FACEBOOK) {
        index++
        texts.push(currentText)
      } else {
        texts[index] = texts[index].concat('\n', currentText)
      }
    })
    return texts
  }

  // modifies the props to keep the children only for the last text message, this message will be the one with buttons and replies
  getNewProps(props, lastText) {
    const propsLastText = { ...props }
    propsLastText.children = [lastText]
    if (Array.isArray(props.children)) {
      props.children
        .filter(e => e.type)
        .forEach(e => propsLastText.children.push(e))
    }
    const propsWithoutChildren = { ...props }
    delete propsWithoutChildren.children
    return { propsLastText, propsWithoutChildren }
  }
}
