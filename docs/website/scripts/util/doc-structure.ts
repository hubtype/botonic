import { join } from 'path'

import {
  readDir,
  readFile,
  readJSON,
  writeJSON,
  writeFile,
} from './file-system'
import { capitalize, generateHeader } from './formatting'
import { PluginInfo } from '../types'
import { PACKAGES, DOCS, SIDEBARS, i18EN, EXTENSIONS } from '../constants'

export const extractPluginInfo = (packageName: string) => {
  const id = getPluginName(packageName)
  const title = getPluginName(packageName)
    .split(PACKAGES.PLUGIN_NAME_SEPARATOR)
    .map(part =>
      part.includes(PACKAGES.PLUGIN_NLU_LOWERCASE)
        ? PACKAGES.PLUGIN_NLU_UPPERCASE
        : capitalize(part)
    )
    .join(' ')
  return { id, title }
}

export const getPluginName = (packageName: string): string =>
  packageName.split(PACKAGES.BOTONIC_PLUGIN_REF)[1]

export const bumpPackageReadmesToPluginsDocs = (
  packagesPath: string,
  pluginsDocsPath: string
): PluginInfo[] => {
  const pluginsInfo: PluginInfo[] = []
  const pluginsDirectories = readDir(packagesPath).filter(dir =>
    dir.includes(PACKAGES.PLUGIN_REF)
  )
  pluginsDirectories.forEach(packageName => {
    const { id, title } = extractPluginInfo(packageName)
    pluginsInfo.push({ id, title })

    const readmePath = join(
      packagesPath,
      packageName,
      `${PACKAGES.README}${EXTENSIONS.MARKDOWN}`
    )
    const readmeContent = readFile(readmePath).split('\n')
    const readmeWithoutTitle = readmeContent
      .slice(1, readmeContent.length) // title already in generated header
      .join('\n')

    const header = generateHeader(packageName, id, title)
    const data = header + readmeWithoutTitle
    const pluginDocPath = join(
      pluginsDocsPath,
      `${getPluginName(packageName)}${EXTENSIONS.MARKDOWN}`
    )
    writeFile(pluginDocPath, data)
  })
  return pluginsInfo
}

export const updateSidebars = (
  sidebarsPath: string,
  pluginsInfo: PluginInfo[]
) => {
  const sidebarsJSON = readJSON(sidebarsPath)
  sidebarsJSON[SIDEBARS.PLUGINS][SIDEBARS.PLUGIN_LIBRARY] = pluginsInfo.map(
    p => `${DOCS.PLUGINS_SEPARATOR}${p.id}`
  )
  writeJSON(sidebarsPath, sidebarsJSON)
}

export const updatei18EN = (i18ENPath: string, pluginsInfo: PluginInfo[]) => {
  const i18nENJSON = readJSON(i18ENPath)
  pluginsInfo.forEach(p => {
    const pluginDocs = i18nENJSON[i18EN.LOCALIZED_STRINGS][i18EN.DOCS]
    if (pluginDocs[`${DOCS.PLUGINS_SEPARATOR}${p.id}`] === undefined) {
      i18nENJSON[i18EN.LOCALIZED_STRINGS][i18EN.DOCS][
        `${DOCS.PLUGINS_SEPARATOR}${p.id}`
      ] = {}
    }
    i18nENJSON[i18EN.LOCALIZED_STRINGS][i18EN.DOCS][
      `${DOCS.PLUGINS_SEPARATOR}${p.id}`
    ][i18EN.PLUGIN_TITLE] = p.title
  })
  writeJSON(i18ENPath, i18nENJSON)
}
