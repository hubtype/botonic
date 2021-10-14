import { CMS } from './cms'
import { Directus } from './directus'
import { DirectusOptions } from './plugin'

export function createCms(options: DirectusOptions): CMS {
  return new Directus(options)
}
