import { join, resolve } from 'path'
import { bumpPackageReadmesToPluginsDocs } from './bump-readmes-to-docs'
import { updatei18EN, updateSidebars } from './update-docs-references'

export interface PluginInfo {
  id: string
  title: string
}

const cwd = process.cwd()
const packagesPath = resolve(join(cwd, '..', '..', 'packages'))
const pluginsDocsPath = resolve(join(cwd, '..', 'docs', 'plugins'))
const pluginsInfo = bumpPackageReadmesToPluginsDocs(
  packagesPath,
  pluginsDocsPath
)
const sidebarsPath = join(cwd, 'sidebars.json')
updateSidebars(sidebarsPath, pluginsInfo)
const i18ENPath = join(cwd, 'i18n', 'en.json')
updatei18EN(i18ENPath, pluginsInfo)
