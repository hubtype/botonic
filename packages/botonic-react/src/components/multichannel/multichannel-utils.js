export function getButtons(node, buttonFilter) {
  const buttons = []
  buttonFilter = buttonFilter || (() => true)
  let isFilteredButton = but => but.type.name == 'Button' && buttonFilter

  for (let n of node) {
    if (n instanceof Array) {
      for (let but of n) {
        if (isFilteredButton(but)) {
          buttons.push(but)
        }
      }
    }
    if (!n.type) {
      continue
    }
    if (isFilteredButton(n)) {
      buttons.push(n)
    }
  }
  return buttons
}

export function buttonHasUrl(button) {
  return button.props.url != null
}
