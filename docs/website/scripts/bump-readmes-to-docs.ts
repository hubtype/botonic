import { readFileSync } from 'fs'
import { readdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const cwd = process.cwd()

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)
const getPluginName = packageName => packageName.split('botonic-')[1]

const generateHeader = packageName => {
  const id = getPluginName(packageName)
  const title = getPluginName(packageName)
    .split('-')
    .map(part => capitalize(part))
    .join(' ')
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
const packagesPath = resolve(join(cwd, '..', '..', 'packages'))
const pluginsDirectories = readdirSync(packagesPath).filter(dir =>
  dir.includes('plugin')
)
const pluginsDocsPath = resolve(join(cwd, '..', 'docs', 'plugins'))
pluginsDirectories.forEach(packageName => {
  const readmePath = join(packagesPath, packageName, 'README.md')
  const pluginDocPath = join(
    pluginsDocsPath,
    `${getPluginName(packageName)}.md`
  )

  const readmeContent = readFileSync(readmePath, 'utf-8').split('\n')
  const readmeWithoutTitle = readmeContent
    .slice(1, readmeContent.length)
    .join('\n')

  const data = generateHeader(packageName) + readmeWithoutTitle
  writeFileSync(pluginDocPath, data)
})
