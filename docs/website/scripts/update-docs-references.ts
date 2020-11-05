import { readJSON, writeJSON } from './file-system'
import { PluginInfo } from './index'

const PLUGINS_SEPARATOR = 'plugins/'
const SIDEBARS = {
  PLUGINS: 'Plugins',
  PLUGIN_LIBRARY: 'Plugin Library',
}
const i18EN = {
  LOCALIZED_STRINGS: 'localized-strings',
  DOCS: 'docs',
  PLUGIN_TITLE: 'title',
}

export const updateSidebars = (
  sidebarsPath: string,
  pluginsInfo: PluginInfo[]
) => {
  const sidebarsJSON = readJSON(sidebarsPath)
  sidebarsJSON[SIDEBARS.PLUGINS][SIDEBARS.PLUGIN_LIBRARY] = pluginsInfo.map(
    p => `${PLUGINS_SEPARATOR}${p.id}`
  )
  writeJSON(sidebarsPath, sidebarsJSON)
}

export const updatei18EN = (i18ENPath: string, pluginsInfo: PluginInfo[]) => {
  const i18nENJSON = readJSON(i18ENPath)
  pluginsInfo.forEach(p => {
    const pluginDocs = i18nENJSON[i18EN.LOCALIZED_STRINGS][i18EN.DOCS]
    if (pluginDocs[`${PLUGINS_SEPARATOR}${p.id}`] === undefined) {
      i18nENJSON[i18EN.LOCALIZED_STRINGS][i18EN.DOCS][
        `${PLUGINS_SEPARATOR}${p.id}`
      ] = {}
    }
    i18nENJSON[i18EN.LOCALIZED_STRINGS][i18EN.DOCS][
      `${PLUGINS_SEPARATOR}${p.id}`
    ][i18EN.PLUGIN_TITLE] = p.title
  })
  writeJSON(i18ENPath, i18nENJSON)
}
