export const removejscssfile = (filename, filetype) => {
  if (typeof window !== 'undefined') {
    const targetelement =
      filetype == 'js' ? 'script' : filetype == 'css' ? 'link' : 'none' //determine element type to create nodelist from
    const targetattr =
      filetype == 'js' ? 'src' : filetype == 'css' ? 'href' : 'none' //determine corresponding attribute to test for
    const allsuspects = document.getElementsByTagName(targetelement)
    for (let i = allsuspects.length; i >= 0; i--) {
      //search backwards within nodelist for matching elements to remove
      if (
        allsuspects[i] &&
        allsuspects[i].getAttribute(targetattr) != null &&
        allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1
      )
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
  }
}
