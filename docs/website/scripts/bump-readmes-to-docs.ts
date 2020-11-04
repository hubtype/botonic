import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const readJSON = filePath => JSON.parse(readFileSync(filePath, 'utf-8'))
const writeJSON = (filePath: string, data) =>
  writeFileSync(filePath, JSON.stringify(data, null, 2))

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
  return { header, id, title }
}
const packagesPath = resolve(join(cwd, '..', '..', 'packages'))
const pluginsDirectories = readdirSync(packagesPath).filter(dir =>
  dir.includes('plugin')
)

const plugins: any = []

pluginsDirectories.forEach(packageName => {
  const readmePath = join(packagesPath, packageName, 'README.md')
  const readmeContent = readFileSync(readmePath, 'utf-8').split('\n')
  const readmeWithoutTitle = readmeContent
    .slice(1, readmeContent.length)
    .join('\n')
  const { header, id, title } = generateHeader(packageName)
  plugins.push({ id, title })
  const data = header + readmeWithoutTitle
  const pluginsDocsPath = resolve(join(cwd, '..', 'docs', 'plugins'))
  const pluginDocPath = join(
    pluginsDocsPath,
    `${getPluginName(packageName)}.md`
  )
  writeFileSync(pluginDocPath, data)
})

const updateSidebars = () => {
  const sidebarsPath = join(cwd, 'sidebars.json')
  const sidebars = readJSON(sidebarsPath)
  sidebars['Plugins']['Plugin Library'] = plugins.map(p => `plugins/${p.id}`)
  writeJSON(sidebarsPath, sidebars)
}
updateSidebars()

const updatei18EN = () => {
  const i18ENPath = join(cwd, 'i18n', 'en.json')
  const i18EN = readJSON(i18ENPath)
  plugins.forEach(p => {
    const pluginDocs = i18EN['localized-strings']['docs']
    if (pluginDocs[`plugins/${p.id}`] === undefined) {
      i18EN['localized-strings']['docs'][`plugins/${p.id}`] = {}
    }
    i18EN['localized-strings']['docs'][`plugins/${p.id}`]['title'] = p.title
  })
  writeJSON(i18ENPath, i18EN)
}
updatei18EN()
