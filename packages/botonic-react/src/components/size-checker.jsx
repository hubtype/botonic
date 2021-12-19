export function getMeta(url) {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ height: img.height, width: img.width })
      img.onerror = reject
      img.src = url
    })
  } catch (e) {
    console.error(e)
  }
}
