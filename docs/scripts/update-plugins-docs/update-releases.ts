import axios from 'axios'
import { writeFileSync } from 'fs'
import { join } from 'path'

const BOTONIC_RELEASES_URL =
  'https://api.github.com/repos/hubtype/botonic/releases'

const SEMVER_REGEX = new RegExp(
  /^v([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/
)

const normalizeReleaseVersion = (releaseName: string) =>
  releaseName.replace(/\./g, '-')

const generateReleaseHeader = (release: any) => {
  const releaseName = release.name
  return `---
id: ${normalizeReleaseVersion(releaseName)}
title: ${releaseName}
---
\n
`
}

export const updateReleases = async (releasesPath: string) => {
  console.log('Fetching releases from Github...')
  const { data } = await axios.get(BOTONIC_RELEASES_URL, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  const releases = data.filter(release =>
    SEMVER_REGEX.exec(release.name)
  ) as any[]
  console.log('Updating releases docs...')
  releases.forEach(release => {
    const fileName = `${normalizeReleaseVersion(release.name)}.md`
    let releaseDocument = generateReleaseHeader(release)
    releaseDocument += release.body
    
    writeFileSync(join(releasesPath, fileName), releaseDocument, { flag: 'w' })
  })
  return releases.map(release => normalizeReleaseVersion(release.name))
}
