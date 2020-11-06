import { join } from 'path'
import { PluginInfo } from '.'
import { readDir, readFile, writeFile } from './file-system'

const toCamelCase = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

const PACKAGES = {
  PLUGIN_NAME_SEPARATOR: '-',
  README: 'README',
  PLUGIN_REF: 'plugin', //refers to 'plugin' in botonic-plugin-name
  BOTONIC_PLUGIN_REF: 'botonic-', //refers to 'botonic-' in botonic-plugin-name
  PLUGIN_NLU_LOWERCASE: 'nlu',
  PLUGIN_NLU_UPPERCASE: 'NLU',
}

const getPluginName = (packageName: string): string =>
  packageName.split(PACKAGES.BOTONIC_PLUGIN_REF)[1]

const extractPluginInfo = (packageName: string) => {
  const id = getPluginName(packageName)
  const title = id
    .split(PACKAGES.PLUGIN_NAME_SEPARATOR)
    .map(part =>
      part.includes(PACKAGES.PLUGIN_NLU_LOWERCASE)
        ? PACKAGES.PLUGIN_NLU_UPPERCASE
        : toCamelCase(part)
    )
    .join(' ')
  return { id, title }
}

export const bumpPackageReadmesToPluginsDocs = (
  packagesPath: string,
  pluginsDocsPath: string
): PluginInfo[] => {
  const pluginsInfo: PluginInfo[] = []
  const pluginsDirectories = readDir(packagesPath).filter(dir =>
    dir.includes(PACKAGES.PLUGIN_REF)
  )
  pluginsDirectories.forEach(packageName => {
    const readmePath = join(packagesPath, packageName, `${PACKAGES.README}.md`)
    const readmeContent = readFile(readmePath).split('\n')
    const readmeWithoutTitle = readmeContent
      .slice(1, readmeContent.length) // title already in generated header
      .join('\n')
    const { id, title } = extractPluginInfo(packageName)
    pluginsInfo.push({ id, title })
    const header = generateHeader(packageName, id, title)
    const data = header + readmeWithoutTitle
    const pluginDocPath = join(
      pluginsDocsPath,
      `${getPluginName(packageName)}.md`
    )
    writeFile(pluginDocPath, data)
  })
  return pluginsInfo
}

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
