import { Directus } from './directus'
import { CMS } from './cms'
import { DirectusOptions } from './plugin'

export function createCms(options: DirectusOptions): CMS {
  return new Directus(options)
}
