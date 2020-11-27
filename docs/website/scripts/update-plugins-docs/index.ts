import { join, resolve } from 'path'

import { bumpPackageReadmesToPluginsDocs } from './bump-readmes-to-docs'
import { updateI18en, updateSidebars } from './update-docs-references'
import { updateReleases } from './update-releases'

export interface PluginInfo {
  id: string
  title: string
}

const cwd = process.cwd()
const packagesPath = resolve(join(cwd, '..', '..', 'packages'))
const docsPath = resolve(join(cwd, '..', 'docs'))
const pluginsDocsPath = resolve(join(docsPath, 'plugins'))
const releasesPath = join(docsPath, 'releases')
;(async () => {
  const releasesNames = await updateReleases(releasesPath)
  const pluginsInfo = bumpPackageReadmesToPluginsDocs(
    packagesPath,
    pluginsDocsPath
  )
  const sidebarsPath = join(cwd, 'sidebars.json')
  updateSidebars(sidebarsPath, pluginsInfo, releasesNames)
  const i18ENPath = join(cwd, 'i18n', 'en.json')
  updateI18en(i18ENPath, pluginsInfo)
})()
