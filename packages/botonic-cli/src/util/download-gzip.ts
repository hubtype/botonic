import { exec } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { readFile, rename, writeFile } from 'node:fs/promises'
import { platform } from 'node:os'
import path from 'node:path'
import { createGunzip } from 'node:zlib'
import { extract } from 'tar'

import { removeRecursively } from './file-system.js'

function pathByOS(...paths: string[]): string {
  const devPlatform = platform()
  const realtivePath = path.join(...paths)
  return devPlatform === 'win32'
    ? realtivePath.replace(/\//g, '\\')
    : realtivePath
}

export async function downloadSelectedProject({
  exampleName,
  exampleVersion,
}: {
  exampleName: string
  exampleVersion: string
}) {
  const exampleNpmNameWithVersion = `@botonic/example-${exampleName}@${exampleVersion}`
  return new Promise((resolve, reject) => {
    exec(`npm pack ${exampleNpmNameWithVersion}`, (error, stdout, _stderr) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
      return
    })
  })
}

export async function extractTarGz({
  projectPath,
  exampleName,
  exampleVersion,
}: {
  projectPath: string
  exampleName: string
  exampleVersion: string
}): Promise<void> {
  // Path to the file .tgz
  const originPath = pathByOS(
    projectPath,
    `botonic-example-${exampleName}-${exampleVersion}.tgz`
  )
  return new Promise((resolve, reject) => {
    // Creates a read stream for the .tgz file
    const readStream = createReadStream(originPath)

    // Create a decompression stream using zlib
    const gunzip = createGunzip()

    // Create an extraction stream to extract the .tgz files.
    const folderStream = extract({ cwd: projectPath })

    // Pipe of the streams: Reading of the file -> Decompression -> Extraction to the destination folder
    readStream.pipe(gunzip).pipe(folderStream)

    // Event handling to monitor extraction success or failure
    folderStream.on('finish', () => {
      removeRecursively(originPath)
      resolve()
    })

    folderStream.on('error', err => {
      console.error('Error while extracting the folder:', err)
      reject(err)
    })
  })
}

export async function renameFolder(botName: string): Promise<void> {
  await rename(pathByOS('.', 'package'), pathByOS('.', botName))
  // console.log('The name of the folder has been changed correctly.')
  return
}

export async function editPackageJsonName(outputPath: string, botName: string) {
  const packageJsonPath = pathByOS(outputPath, botName, 'package.json')

  const data = await readFile(packageJsonPath, 'utf8')

  // Parse JSON content in a JavaScript object
  const jsonData = JSON.parse(data)

  // Modify the value of the attribute 'name'
  jsonData.name = botName
  // Modify the value of the attribute 'version'
  jsonData.version = '0.1.0'

  // Convert the modified object back to JSON format
  const updatedJsonData = JSON.stringify(jsonData, null, 2)

  // Write the modified object back to the JSON file
  return writeFile(packageJsonPath, updatedJsonData)
}
