export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const generateHeader = (
  packageName: string,
  id: string,
  title: string
) => {
  const header = `---
title: ${title}
id: ${id}
---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/${packageName})**.

---

`
  return header
}
