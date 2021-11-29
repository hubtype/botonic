import decompress from 'decompress'
import download from 'download'
import { existsSync, unlinkSync } from 'fs'
import { platform } from 'os'
import { join } from 'path'
import { extract } from 'tar'

import { getCleanVersionForPackage, getHomeDirectory } from '../system-utils'

export class PulumiDownloader {
  private PULUMI_SDK_URL = 'https://get.pulumi.com/releases/sdk'
  private installationPath: string

  constructor(installationPath: string) {
    this.installationPath = installationPath
  }

  isBinaryInstalled(): boolean {
    const BINARY_NAME = 'pulumi'
    return existsSync(join(this.getBinaryPath(), BINARY_NAME))
  }

  async downloadBinaryIfNotInstalled(
    version = '3.11.0' // getCleanVersionForPackage('@pulumi/pulumi')
  ): Promise<any> {
    if (!this.isBinaryInstalled()) {
      console.log('It seems that it is the first time using Botonic 1.0')
      console.log(`Downloading Pulumi ${version}...`)
      if (!version) {
        throw new Error('Cannot retrieve Pulumi version to download')
      }
      await this.downloadBinaries(version)
      console.log('Pulumi downloaded.')
    } else {
      console.log('Detected Pulumi in your machine.')
    }
    return { binaryPath: this.getBinaryPath(), binary: this.getBinary() }
  }

  private async downloadBinaries(version: string): Promise<void> {
    const devPlatform = platform()
    if (devPlatform === 'darwin') {
      await this.setupDarwin(version, this.installationPath)
    } else if (devPlatform === 'linux') {
      await this.setupLinux(version, this.installationPath)
    } else if (devPlatform === 'win32') {
      await this.setupWindows(version, this.installationPath)
    } else {
      throw Error(
        `Cannot download Pulumi binaries - platform "${devPlatform}" not supported. Supported ones are "darwin", "linux", and "win32"`
      )
    }
  }
  private async setupDarwin(
    version: string,
    downloadFolder: string
  ): Promise<void> {
    const filename = `pulumi-v${version}-darwin-x64.tar.gz`
    const downloadUrl = `${this.PULUMI_SDK_URL}/${filename}`
    await download(downloadUrl, downloadFolder)
    await extract({
      cwd: downloadFolder,
      file: join(downloadFolder, filename),
    })
    unlinkSync(join(downloadFolder, filename))
  }

  private async setupWindows(
    version: string,
    downloadFolder: string
  ): Promise<void> {
    const filename = `pulumi-v${version}-windows-x64.zip`
    const downloadUrl = `${this.PULUMI_SDK_URL}/${filename}`
    await download(downloadUrl, downloadFolder)
    const archive = join(downloadFolder, filename)
    const destination = join(downloadFolder, 'pulumi')
    await decompress(archive, destination, { strip: 2 })
    unlinkSync(join(downloadFolder, filename))
  }

  private async setupLinux(
    version: string,
    downloadFolder: string
  ): Promise<void> {
    const filename = `pulumi-v${version}-linux-x64.tar.gz`
    const downloadUrl = `${this.PULUMI_SDK_URL}/${filename}`
    await download(downloadUrl, downloadFolder)
    await extract({
      cwd: downloadFolder,
      file: join(downloadFolder, filename),
    })
    unlinkSync(join(downloadFolder, filename))
  }

  getBinaryPath(): string {
    const BINARY_DIR_NAME = 'pulumi'
    return join(this.installationPath, BINARY_DIR_NAME)
  }

  getBinary(): string {
    const BINARY_NAME = 'pulumi'
    return join(this.getBinaryPath(), BINARY_NAME)
  }
}
